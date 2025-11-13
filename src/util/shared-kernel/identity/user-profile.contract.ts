/**
 * Define o contrato mínimo de dados que o consumidor espera.
 */
export interface UserProfile {
  id: number | string;
  name: string;
  companyId: number;
}
