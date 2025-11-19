import { RoleType } from './entities/role.entity';

export const PERMISSIONS = {
  company: {
    create: 'Criar empresa',
    read: 'Ler empresa',
    update: 'Editar empresa',
    delete: 'Excluir empresa',
  },
  user: {
    create: 'Criar usuário',
    read: 'Ler usuário',
    update: 'Editar usuário',
    delete: 'Excluir usuário',
    list: 'Listar usuários',
  },
  role: {
    create: 'Criar função',
    read: 'Ler função',
    update: 'Editar função',
    delete: 'Excluir função',
    list: 'Listar funções',
  },
  menu: {
    create: 'Criar item de menu',
    read: 'Ler item de menu',
    update: 'Editar item de menu',
    delete: 'Excluir item de menu',
    list: 'Listar itens de menu',
  },
  table: {
    create: 'Criar mesa',
    read: 'Ler mesa',
    update: 'Editar mesa',
    delete: 'Excluir mesa',
    list: 'Listar mesas',
  },
  order: {
    create: 'Criar pedido',
    read: 'Ler pedido',
    update: 'Editar pedido',
    delete: 'Excluir pedido',
    list: 'Listar pedidos',
  },
  kitchen: {
    list: 'Listar itens da cozinha',
    read: 'Ver item da cozinha',
    create: 'Criar item na cozinha',
    update: 'Atualizar item da cozinha',
    delete: 'Excluir item da cozinha',
  },
} as const;

export type PermissionKey =
  `${keyof typeof PERMISSIONS}.${keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]}`;

export const ROLES = {
  [RoleType.ADMIN]: {
    name: RoleType.ADMIN,
    description: 'Administrador - Acesso CRUD total a todas as entidades',
    permissions: [
      'company.create',
      'company.read',
      'company.update',
      'company.delete',

      'user.create',
      'user.read',
      'user.update',
      'user.delete',
      'user.list',

      'role.create',
      'role.read',
      'role.update',
      'role.delete',
      'role.list',

      'menu.create',
      'menu.read',
      'menu.update',
      'menu.delete',
      'menu.list',

      'table.create',
      'table.read',
      'table.update',
      'table.delete',
      'table.list',

      'order.create',
      'order.read',
      'order.update',
      'order.delete',
      'order.list',

      'kitchen.list',
      'kitchen.read',
      'kitchen.create',
      'kitchen.update',
      'kitchen.delete',
    ] as const,
  },
  [RoleType.MANAGER]: {
    name: RoleType.MANAGER,
    description:
      'Gerente - CRUD total em Menu e visualização em outras entidades',
    permissions: [
      'company.read',
      'user.read',
      'user.list',
      'role.list',

      'menu.create',
      'menu.read',
      'menu.update',
      'menu.delete',
      'menu.list',

      'table.read',
      'table.list',
      'order.read',
      'order.list',
    ] as const,
  },
  [RoleType.WAITER]: {
    name: RoleType.WAITER,
    description: 'Garçom - Criação e leitura de Pedidos e Mesas',
    permissions: [
      'company.read',
      'user.list',
      'menu.read',
      'menu.list',
      'table.read',
      'table.list',
      'order.create',
      'order.read',
      'order.update',
      'order.list',
    ] as const,
  },
  [RoleType.KITCHEN]: {
    name: RoleType.KITCHEN,
    description: 'Cozinha - Leitura e Atualização de itens da Cozinha',
    permissions: ['kitchen.list', 'kitchen.read', 'kitchen.update'] as const,
  },
  [RoleType.CASHIER]: {
    name: RoleType.CASHIER,
    description: 'Caixa - Leitura de Pedidos e Mesas',
    permissions: [
      'company.read',
      'user.list',
      'table.read',
      'order.read',
      'order.list',
    ] as const,
  },
} as const;

export type RoleName = keyof typeof ROLES;
