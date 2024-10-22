import { Role } from "./role";

export interface SystemUser {
  email: string;
  username: string;
  role: Role;
}
