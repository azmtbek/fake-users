import { Faker, Randomizer } from "@faker-js/faker";
import { ENGLISH_CHARS, INPUT_MAX_VALUE, JAPANESE_CHARS, POLISH_CHARS, REGIONS, SPANISH_CHARS } from "./consts";
import { Person } from "./data-maker";

const times = (n: number, faker: Faker, region: string, fn: (data: string, faker: Faker, region: string, isNumber?: boolean) => string) => {
  if (n < 0) throw new Error("The first argument cannot be negative.");
  return (data: string, isNumber?: boolean) => {
    for (let i = Math.min(INPUT_MAX_VALUE, Math.floor(n)); i--;) data = fn(data, faker, region, isNumber);
    return faker.number.int(100) / 100 < n % 1 ? fn(data, faker, region, isNumber) : data;
  };
};

const getFullName = (error: number, faker: Faker, region: string, fullName: string): string => {
  const errored = times(error, faker, region, makeError);
  const names = fullName.split(' ');
  return names.map(name => errored(name)).join(' ');
};

const getAddress = (error: number, faker: Faker, region: string, fullAddress: string): string => {
  const erroredAddress = times(error, faker, region, makeError);
  const addresses = fullAddress.split(' ');
  return addresses.map(addr => erroredAddress(addr)).join(' ');
};

const getPhone = (error: number, faker: Faker, region: string, phone: string): string => {
  const errored = times(error, faker, region, makeError);
  const isNumber = true;
  return errored(phone, isNumber);
};

const getRandomChar = (random: number, region: string) => {
  let chars: string[] = [];
  switch (region) {
    case REGIONS.US:
      chars = ENGLISH_CHARS;
      break;
    case REGIONS.PL:
      chars = POLISH_CHARS;
      break;
    case REGIONS.ES:
      chars = SPANISH_CHARS;
      break;
    case REGIONS.JA:
      chars = JAPANESE_CHARS;
      break;
    default:
      chars = ENGLISH_CHARS;
      break;
  }
  const randomCharCode = Math.floor(random * chars.length);
  return chars[randomCharCode];
};



const makeError = (data: string, faker: Faker, region: string, isNumber?: boolean) => {
  const random = faker.number.int(100000) / 100000;

  const errorTypes = ['delete', 'add', 'swap'];
  const randomErrorIndex = Math.floor(random * errorTypes.length);
  const randomErrorType = errorTypes[randomErrorIndex];
  const init = data;
  switch (randomErrorType) {
    case 'delete':
      const deleteIndex = Math.floor(random * data.length);
      data = data.slice(0, deleteIndex) + data.slice(deleteIndex + 1);
      break;
    case 'add':
      const addIndex = Math.floor(random * (data.length + 1));
      const randomChar = isNumber ? faker.number.int(10) : getRandomChar(random, region);
      data = data.slice(0, addIndex) + randomChar + data.slice(addIndex);
      break;
    case 'swap':
      if (data.length <= 1) break;
      const swapIndex = Math.floor(random * (data.length - 1));
      data = data.slice(0, swapIndex) + data[swapIndex + 1] + data[swapIndex] + data.slice(swapIndex + 2);
      break;
    default:
      break;
  }
  return data;
};


export const errorMaker = (error: number, faker: Faker, region: string, data: Person[]) => {
  return data.map(person => ({
    ...person,
    fullName: getFullName(error, faker, region, person.fullName),
    address: getAddress(error, faker, region, person.address),
    phone: getPhone(error, faker, region, person.phone)
  }));
};