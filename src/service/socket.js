import io from "socket.io-client";
import { API_BASE_URL } from "configs/AppConfig";

export const socket = io(`${API_BASE_URL}/quiz`);
