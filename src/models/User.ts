/**
 * Базовый интерфейс пользователя.
 */
export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  /**
   * Фото пользователя.
   * Это может быть:
   * - обычный URL (https://...)
   * - относительный путь (/images/user1.png)
   * - data URL (base64), если загружаем фото с клиента
   */
  photoUrl?: string;
}

/**
 * Модель пользователя.
 */
export class UserModel implements IUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  photoUrl?: string;

  constructor(data: IUser) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.age = data.age;
    this.email = data.email;
    this.photoUrl = data.photoUrl;
  }

  /** Полное имя пользователя */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /** Совершеннолетним? */
  get isAdult(): boolean {
    return this.age >= 18;
  }

  /** Для получения "сырых" данные (например, из JSON) */
  static fromPlain(plain: IUser): UserModel {
    return new UserModel(plain);
  }

  /** Преобразование в простой объект (например, для сохранения в localStorage) */
  toPlain(): IUser {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      age: this.age,
      email: this.email,
      photoUrl: this.photoUrl,
    };
  }
}
