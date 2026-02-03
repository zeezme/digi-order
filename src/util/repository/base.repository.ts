import { EntityRepository } from '@mikro-orm/postgresql';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import {
  FilterQuery,
  FindOptions,
  EntityData,
  wrap,
  EntityName,
  RequiredEntityData,
  helper,
  AutoPath,
  Loaded,
  Populate,
  FindOneOptions,
} from '@mikro-orm/core';
import { AuditRepository } from './audit.repository';
import { getRequestContext } from '../interceptors/context.interceptor';

interface FindAllOptions<T, P extends string = any> {
  where?: FilterQuery<T>;
  populate?: Populate<T, P>;
  orderBy?: FindOptions<T>['orderBy'];
  fields?: FindOptions<T>['fields'];
  limit?: number;
  offset?: number;
}

interface FindByIdOptions<T, P extends string = any> {
  id: number | string;
  populate?: readonly AutoPath<T, P>[];
  fields?: FindOptions<T>['fields'];
}

interface FindOneByOptions<T, P extends string = any> {
  where: FilterQuery<T>;
  populate?: readonly AutoPath<T, P>[];
  orderBy?: FindOptions<T>['orderBy'];
  fields?: FindOptions<T>['fields'];
}

interface CreateEntityOptions<T> {
  data: EntityData<T>;
}

interface UpdateEntityOptions<T> {
  entity: T;
  data: Partial<T>;
}

interface DeleteEntityOptions<T> {
  entity: T;
}

interface DeleteByIdOptions {
  id: number | string;
}

interface CountByOptions<T> {
  where?: FilterQuery<T>;
}

interface ExistsOptions<T> {
  where: FilterQuery<T>;
}

export abstract class BaseRepository<
  T extends object,
> extends EntityRepository<T> {
  private auditCallback?: (
    status: 'success' | 'error',
    action: string,
    context?: Record<string, any>,
  ) => Promise<void>;

  private enableSystemAudit = false;

  private readonly SYSTEM_USER_ID = '0';
  private readonly SYSTEM_COMPANY_ID = 0;

  constructor(
    em: SqlEntityManager,
    entityClass: new () => T,
    auditRepo?: AuditRepository,
    entityType?: string,
  ) {
    super(em, entityClass);

    if (auditRepo && entityType) {
      this.setAuditCallback(async (status, action, context) => {
        const finalCtx = context as Record<string, any>;

        const companyId = Number(
          finalCtx.companyId ??
            (finalCtx.data as { companyId?: unknown })?.companyId ??
            this.SYSTEM_COMPANY_ID,
        );

        const userId =
          finalCtx.userId ??
          (companyId === this.SYSTEM_COMPANY_ID
            ? this.SYSTEM_USER_ID
            : undefined);

        await auditRepo.logAction({
          companyId,
          entityType,
          entityId: finalCtx.entityId,
          action: action.toUpperCase(),
          userId: userId,
          newValues: { status, context: finalCtx },
        });
      });
    }
  }

  public setSystemAudit(enabled: boolean): void {
    this.enableSystemAudit = enabled;
  }

  private buildAuditContext(
    context: Record<string, any> = {},
    isSystemAudit: boolean,
  ): Record<string, any> {
    if (isSystemAudit) {
      return {
        ...context,
        userId: this.SYSTEM_USER_ID,
        companyId: this.SYSTEM_COMPANY_ID,
      };
    }

    const { userId, companyId } = getRequestContext();

    return {
      ...context,
      userId: userId ?? context.userId,
      companyId: companyId ?? context.companyId,
    };
  }

  public setAuditCallback(
    callback: (
      status: 'success' | 'error',
      action: string,
      context?: Record<string, any>,
    ) => Promise<void>,
  ): void {
    this.auditCallback = callback;
  }

  private extractEntityId(entity: T): string | number | null {
    try {
      const pk = helper(entity).getPrimaryKey();

      if (pk == null) {
        return null;
      }

      if (Array.isArray(pk)) {
        return pk.filter((v) => v != null).join('-') || null;
      }

      return pk as string | number;
    } catch (error) {
      console.warn('[BaseRepository] Failed to extract entityId:', error);
      return null;
    }
  }

  private async handleAudit(
    status: 'success' | 'error',
    action: string,
    context: Record<string, any>,
    isSystemAudit: boolean,
  ): Promise<void> {
    if (!this.auditCallback) return;

    const entity = context.entity as T | undefined;
    const entityId = entity ? this.extractEntityId(entity) : null;

    const auditCtx = {
      ...this.buildAuditContext(context, isSystemAudit),
      entityId,
    };

    try {
      await this.auditCallback(status, action, auditCtx);
    } catch (auditError) {
      console.error(`[Audit Logging Failed: ${action}]`, auditError);
    }
  }

  private async handleError(
    error: Error,
    action: string,
    context: Record<string, any>,
    isSystemAudit: boolean,
  ): Promise<never> {
    console.error(`[${this.getEntityName()}] Operation failed:`, error);

    await this.handleAudit(
      'error',
      action,
      { ...context, error },
      isSystemAudit,
    );

    throw error;
  }

  public getEntityName(): string {
    const name: EntityName<T> = this.entityName;
    if (typeof name === 'string') return name;
    if (typeof name === 'function' && name.name) return name.name;
    return 'UnknownEntity';
  }

  async findAllEntities<P extends string = any>(
    options: FindAllOptions<T, P> = {},
  ): Promise<Loaded<T, P>[]> {
    const { where = {}, populate = [], ...restOptions } = options;

    const findOptions: FindOptions<T, P> = {
      populate: populate as any,
      ...restOptions,
    };

    return this.find(where, findOptions);
  }

  async findById<P extends string = any>(
    options: FindByIdOptions<T, P>,
  ): Promise<Loaded<T, P> | null> {
    const { id, populate, fields } = options;

    return this.findOne(
      { id } as FilterQuery<T>,
      { populate, fields } as FindOneOptions<T, P>,
    );
  }

  async findOneBy<P extends string = any>(
    options: FindOneByOptions<T, P>,
  ): Promise<Loaded<T, P> | null> {
    const { where, ...findOptions } = options;

    return this.findOne(where, findOptions as FindOneOptions<T, P>);
  }

  async createEntity(options: CreateEntityOptions<T>): Promise<T> {
    const { data } = options;
    const isSystemAudit = this.enableSystemAudit;

    try {
      const entity = this.create(data as RequiredEntityData<T>);

      await this.getEntityManager().persistAndFlush(entity);

      await this.handleAudit(
        'success',
        'create',
        { data, entity },
        isSystemAudit,
      );

      return entity;
    } catch (error) {
      await this.handleError(error as Error, 'create', { data }, isSystemAudit);
      throw error;
    }
  }

  async updateEntity(options: UpdateEntityOptions<T>): Promise<T> {
    const { entity, data } = options;
    const isSystemAudit = this.enableSystemAudit;

    try {
      wrap(entity).assign(data as any, { merge: true });

      await this.getEntityManager().flush();

      await this.handleAudit(
        'success',
        'update',
        { data, entity },
        isSystemAudit,
      );
      return entity;
    } catch (error) {
      await this.handleError(error as Error, 'update', { data }, isSystemAudit);
      throw error;
    }
  }

  async deleteEntity(options: DeleteEntityOptions<T>): Promise<void> {
    const { entity } = options;
    const isSystemAudit = this.enableSystemAudit;

    try {
      await this.getEntityManager().removeAndFlush(entity);

      await this.handleAudit('success', 'delete', { entity }, isSystemAudit);
    } catch (error) {
      await this.handleError(
        error as Error,
        'delete',
        { entity },
        isSystemAudit,
      );
      throw error;
    }
  }

  async deleteById(options: DeleteByIdOptions): Promise<boolean> {
    const { id } = options;
    const isSystemAudit = this.enableSystemAudit;

    try {
      const entity = await this.findById({ id });
      if (!entity) return false;
      await this.deleteEntity({ entity });
      return true;
    } catch (error) {
      await this.handleError(error as Error, 'delete', { id }, isSystemAudit);
      throw error;
    }
  }

  async countBy(options: CountByOptions<T> = {}): Promise<number> {
    const { where = {} } = options;
    return this.count(where);
  }

  async exists(options: ExistsOptions<T>): Promise<boolean> {
    const { where } = options;
    return (await this.count(where)) > 0;
  }

  public connect<E extends object>(
    entity: EntityName<E>,
    value: E | number | string,
  ): E {
    if (typeof value === 'object') {
      return value;
    }

    return this.getEntityManager().getReference(
      entity,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      value as any,
    ) as unknown as E;
  }
}
