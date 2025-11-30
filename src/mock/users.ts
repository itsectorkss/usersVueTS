import { UserModel, type IUser } from '../models/User';

/**
 * "Сырые" данные пользователей, обычные объекты.
 * Это то, что могло бы прийти с сервера / API.
 */
const usersData: IUser[] = [
  {
    id: 1,
    firstName: 'Иван',
    lastName: 'Иванов',
    age: 25,
    email: 'ivan.ivanov@example.com',
  },
  {
    id: 2,
    firstName: 'Мария',
    lastName: 'Петрова',
    age: 17,
    email: 'maria.petrova@example.com',
    photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSzQknKWRoLAJFaumSsRmiAzHlVpyZ0N7yNQ&s',
  },
  {
    id: 3,
    firstName: 'Алексей',
    lastName: 'Сидоров',
    age: 32,
    email: 'alexey.sidorov@example.com',
    photoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTROTqJBzM-g9wjXGCD3oDjWyvgKvyhxKU4KA&s"
  },
  {
    id: 4,
    firstName: 'Ольга',
    lastName: 'Кузнецова',
    age: 19,
    email: 'olga.kuznetsova@example.com',
    photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2ZE9NYSfsJfyCdJ2-0G4C2cijWObjE4eLjw&s',
  },
  {
    id: 5,
    firstName: 'Дмитрий',
    lastName: 'Смирнов',
    age: 15,
    email: 'dmitry.smirnov@example.com',
    photoUrl: "https://tmkos.ru/wp-content/uploads/2017/12/DSC_2318-1-700x467.jpg",
  },
];

/**
 * Готовый массив моделей пользователей для использования в приложении.
 */
export const mockUsers: UserModel[] = usersData.map(UserModel.fromPlain);

/**
 * Получение пользователей.
 */
export function getMockUsers(): UserModel[] {
  return mockUsers;
}
