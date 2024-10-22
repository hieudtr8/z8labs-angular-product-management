import { Role } from "./role";

export interface SystemUser {
  id: string
  email: string;
  username: string;
  role: Role;
}
