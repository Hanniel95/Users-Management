export interface UserModel {
  id: number;
  first_name: string;
  last_name?: string;
  gender?: "M" | "F";
  email?: string;
  createdAt: string;
  updatedAt: string;
}
