// Your custom session type definition
import {RoomVO} from "../vo/RoomVO";

export interface SessionData {
    isAdmin ?: boolean ;
    adminId?: number;
    isUser ?: boolean;
    userId?: number;
    room?: RoomVO;
}
