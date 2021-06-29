import { UserStatus } from '../../enums/user.status';
import { UserRole } from '../../enums/user.role';

export interface PayloadInterface {
    username: string,
    email: string,
    role: UserRole,
    sub: string,
    status: UserStatus

}
