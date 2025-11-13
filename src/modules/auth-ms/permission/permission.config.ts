import { RoleType } from './entities/role.entity';

export const PERMISSIONS = {
  company: {
    create: 'Criar empresa',
    read: 'Ler empresa',
    update: 'Editar empresa',
    delete: 'Excluir empresa',
  },
  user: {
    invite: 'Convidar usuário',
    remove: 'Remover usuário',
    list: 'Listar usuários',
  },
  role: {
    assign: 'Atribuir função',
    manage: 'Gerenciar funções',
    create: 'Criar função',
    update: 'Editar função',
    delete: 'Excluir função',
    list: 'Listar funções',
  },
  kitchen: {
    'item.list': 'Listar itens da cozinha',
    'item.read': 'Ver item da cozinha',
    'item.create': 'Criar item na cozinha',
    'item.update': 'Atualizar status do item',
    'item.delete': 'Excluir item da cozinha',
  },
} as const;

export type PermissionKey =
  `${keyof typeof PERMISSIONS}.${keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]}`;

/**
 * Definição de roles padrão do sistema
 */
export const ROLES = {
  [RoleType.ADMIN]: {
    name: RoleType.ADMIN,
    description: 'Administrador - pode gerenciar usuários e configurações',
    permissions: [
      'company.read',
      'company.update',
      'user.invite',
      'user.remove',
      'user.list',
      'role.assign',
      'role.list',
      'kitchen.item.list',
      'kitchen.item.read',
      'kitchen.item.create',
      'kitchen.item.update',
    ] as const,
  },
  [RoleType.MANAGER]: {
    name: RoleType.MANAGER,
    description: 'Gerente - pode convidar e visualizar',
    permissions: [
      'company.read',
      'user.invite',
      'user.list',
      'role.list',
    ] as const,
  },
  [RoleType.WAITER]: {
    name: RoleType.WAITER,
    description: 'Garçom - acesso ao pedido',
    permissions: ['company.read', 'user.list'] as const,
  },
  [RoleType.KITCHEN]: {
    name: RoleType.KITCHEN,
    description: 'Cozinha - gerencia os itens da cozinha',
    permissions: [
      'kitchen.item.list',
      'kitchen.item.read',
      'kitchen.item.create',
      'kitchen.item.update',
    ],
  },
  [RoleType.CASHIER]: {
    name: RoleType.CASHIER,
    description: 'Caixa - finaliza pedidos',
    permissions: ['company.read', 'user.list'] as const,
  },
} as const;

export type RoleName = keyof typeof ROLES; // RoleType
