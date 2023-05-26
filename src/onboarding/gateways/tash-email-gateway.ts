export interface TrashEmailGateway {
  isTrash(email: string): Promise<boolean>
}
