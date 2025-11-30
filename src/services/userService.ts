import { UserModel, type IUser } from '../models/User';

/**
 * Загружает список пользователей из public/users.json
 * и преобразует их в массив UserModel.
 */
export async function fetchUsers(): Promise<UserModel[]> {
  const response = await fetch('users.json');

  if (!response.ok) {
    throw new Error(`Ошибка загрузки users.json: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as IUser[];

  return data.map((item) => UserModel.fromPlain(item));
}
