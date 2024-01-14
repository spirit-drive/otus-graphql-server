# Otus graphql сервер

С помощью этого сервера можно реализовать домашние работы и дипломный проект.
Советую использовать [apollographql react](https://www.apollographql.com/docs/react)

## API

### Основной url
http://cea3c11a3f62.vps.myjino.ru/graphql

Используйте любой graphql клиент, чтобы посмотреть документацию.
Например, [altair](https://chrome.google.com/webstore/detail/altair-graphql-client/flnheeellpciglgpaodhkhmapeljopja)

### Сущности
#### Category
```ts
type Category = {
  id: string;
  name: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
};
```
#### Order

```ts
type Order = {
  id: string;
  products: OrderProduct[];
  user: User;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

type OrderProduct = {
  _id: string; // служебный id - это не id продукта
  product: Product;
  quantity: number;
}

enum OrderStatus {
  PendingConfirmation = 'pending_confirmation',
  Processing = 'processing',
  Packaging = 'packaging',
  WaitingForDelivery = 'waiting_for_delivery',
  InTransit = 'in_transit',
  Delivered = 'delivered',
  ReturnRequested = 'return_requested',
  OrderCancelled = 'order_cancelled',
}
```

#### Operation
```ts
type Cost = {
  id: string;
  name: string;
  desc?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  amount: number;
  category: Category;
  type: 'Cost';
};

type Profit = {
  id: string;
  name: string;
  desc?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  amount: number;
  category: Category;
  type: 'Profit';
};

type Operation = Profit | Cost;
```
#### Product
```ts
type Product = {
  id: string;
  name: string;
  photo?: string;
  desc?: string;
  createdAt: Date;
  updatedAt: Date;
  oldPrice?: number;
  price: number;
  category: Category;
};
```

#### Дополнительные типы
```ts
export type Pagination = {
  pageSize?: number;
  pageNumber?: number;
};

export type Sorting = {
  type: 'ASC' | 'DESC';
  field: 'id' | 'createdAt' | 'updatedAt' | 'name' | 'date';
};
```


### Работа с токеном

Некоторые запросы открытые, другие - защищенные

Для отправки защищенных запросов нужно добавить токен в заголовок **authorization** и добавить префикс: `Bearer ${token}`.

Подробнее про [авторизацию](https://www.apollographql.com/docs/react/networking/authentication) в graphql


### Файлы (Общее)
#### /upload POST **PROTECTED**
Загружает файлы на сервер.

Возвращает

```json
{
  "url": "..."
}
```

##### Пример загрузки изображения на сервер с помощью fetch
```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const [file] = e.target.files;
  const body = new FormData();
  // важно использовать название file append('file', ...) иначе работать не будет
  body.append('file', file);
  fetch('http://cea3c11a3f62.vps.myjino.ru/api/upload', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'POST',
    body,
  })
    .then(res => res.json())
    .then(({ url }) => onChange(url))
    .catch((err) => {
      console.error(err);
    })
};

...

<input type="file" onChange={handleChange} />
```

##### Пример загрузки изображения на сервер с помощью XMLHttpRequest
```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const [file] = e.target.files;
  const body = new FormData();
  // важно использовать название file append('file', ...) иначе работать не будет
  body.append('file', file);
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function (event) {
      // Здесь можно получать количество отправленных данных на сервер, что позволяет сделать индикатор загрузки изображения  
      onProgress(event.loaded, event.total);
    };
    xhr.onload = function () {
      if (xhr.status !== 200) {
        reject(xhr);
      } else {
        resolve(JSON.parse(xhr.response));
      }
    };

    xhr.onerror = () => {
      Object.assign(xhr, { message: 'unknown error' });
      reject(xhr);
    };

    xhr.open('POST', 'http://cea3c11a3f62.vps.myjino.ru/api/upload');

    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.send(body);
  })
    .then(({ url }) => onChange(url))
    .catch((err) => {
      console.error(err);
    })
};

...

<input type="file" onChange={handleChange} />
```


#### Ошибки

Все ошибки с сервера приходят в формате
```ts
type ServerErrors = {
  errors: {
    extensions: {
      code: ErrorCode;
      fieldName?: string;
      stacktrace: string;
    };

    name: string;
    message: string;
  }[];
}

enum ErrorCode {
  ERR_INCORRECT_EMAIL_OR_PASSWORD = 'ERR_INCORRECT_EMAIL_OR_PASSWORD', // Если не корректный email или пароль
  ERR_ACCOUNT_ALREADY_EXIST = 'ERR_ACCOUNT_ALREADY_EXIST', // При регистрации если пользователь уже существует
  ERR_FIELD_REQUIRED = 'ERR_FIELD_REQUIRED', // Обязательное поле. В ошибке будет дополнительное поле fieldName с указанием, какое конкретно поле обязательно
  ERR_INCORRECT_PASSWORD = 'ERR_INCORRECT_PASSWORD', // Некорректный старый пароль при попытке его изменить
  ERR_INVALID_PASSWORD = 'ERR_INVALID_PASSWORD', // Пароль не соответствует регулярному выражению /^[\w-@{}()#$%^&*+=!~]{8,}$/
  ERR_NOT_VALID = 'ERR_NOT_VALID', // Не валидный id сущности
  ERR_AUTH = 'ERR_AUTH', // Токен не передан, либо не прошел авторизацию
  ERR_NO_FILES = 'ERR_NO_FILES', // Ошибка при загрузке файлов
  ERR_NOT_ALLOWED = 'ERR_NOT_ALLOWED', // Нет доступа к данной операции (нельзя редактировать заказ другого пользователя)
  ERR_NOT_FOUND = 'ERR_NOT_FOUND', // Сущность не найдена
  ERR_VALIDATION_ERROR = 'ERR_VALIDATION_ERROR', // Не валидные данные, например, не указано name
  
  ERR_INTERNAL_SERVER = 'ERR_INTERNAL_SERVER', // Серверная ошибка. Обратитесь ко мне, этой ошибки быть не должно
}
```
