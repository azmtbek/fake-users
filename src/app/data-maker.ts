import {
  Faker,
  Randomizer,
  fakerPL, fakerES, fakerEN_US,
  faker as fakerGlobal,
  fakerJA
} from '@faker-js/faker';
import { ColumnSort, SortingState } from '@tanstack/react-table';
import { FormState } from './page';
import { INPUT_MAX_VALUE, REGIONS } from './consts';
import { RandomGenerator, xoroshiro128plus } from 'pure-rand';

const DATA_SIZE = 1_000;

export type Person = {
  id: number;
  uuid: string;
  fullName: string;
  address: string;
  phone: string;
};

export type PersonApiResponse = {
  data: Person[];
  meta: {
    totalRowCount: number;
  };
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const times = (n: number, randomizer: Randomizer, faker: Faker, fn: (data: string, faker: Faker, random: number) => string) => {
  if (n < 0) throw new Error("The first argument cannot be negative.");
  return (data: string) => {
    for (let i = Math.min(INPUT_MAX_VALUE, Math.floor(n)); i--;) data = fn(data, faker, randomizer.next());
    return randomizer.next() < n % 1 ? fn(data, faker, randomizer.next()) : data;
  };
};

const getFullName = (faker: Faker, randomizer: Randomizer, error: number): string => {
  const erroredFullName = times(error, randomizer, faker, emulateError);
  return erroredFullName(faker.person.firstName()) + ' '
    + erroredFullName(faker.person.middleName()) + ' '
    + erroredFullName(faker.person.lastName());
};

const getAddress = (faker: Faker, randomizer: Randomizer, error: number): string => {
  const erroredAddress = times(error, randomizer, faker, emulateError);
  const fullAddress = faker.location.streetAddress(true).split(' ');
  return fullAddress.map(addr => erroredAddress(addr)).join(' ');
};


const newPerson = (faker: Faker, randomizer: Randomizer, error: number, index: number): Person => {
  return {
    id: index + 1,
    uuid: faker.string.uuid(),
    fullName: getFullName(faker, randomizer, error),
    address: getAddress(faker, randomizer, error),
    phone: faker.phone.number(),
  };
};

export function makeData(faker: Faker, randomizer: Randomizer, error: number, ...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((d): Person => {
      return {
        ...newPerson(faker, randomizer, error, d),
      };
    });
  };

  return makeDataLevel();
}

export function generatePureRandRandomizer(
  seed: number | number[] = Date.now() ^ (Math.random() * 0x100000000),
  factory: (seed: number) => RandomGenerator = xoroshiro128plus
): Randomizer {
  const self = {
    next: () => (self.generator.unsafeNext() >>> 0) / 0x100000000,
    seed: (seed: number | number[]) => {
      self.generator = factory(typeof seed === 'number' ? seed : seed[0]);
    },
  } as Randomizer & { generator: RandomGenerator; };
  self.seed(seed);
  return self;
}


function emulateError(data: string, faker: Faker, random: number) {
  // Seeded random number generator
  // const random = randomizer.next();

  // Randomly choose an error type based on the seeded random number
  const errorTypes = ['delete', 'add', 'swap'];
  const randomErrorIndex = Math.floor(random * errorTypes.length);
  const randomErrorType = errorTypes[randomErrorIndex];

  // Emulate data entry error based on the chosen error type
  switch (randomErrorType) {
    case 'delete':
      // Delete a character at random position
      const deleteIndex = Math.floor(random * data.length);
      data = data.substring(0, deleteIndex) + data.substring(deleteIndex + 1);
      break;
    case 'add':
      // Add a random character from a proper alphabet in random position
      const addIndex = Math.floor(random * (data.length + 1)); // Add at any position
      const randomCharCode = 97 + Math.floor(random * 26); // Random lowercase letter
      const randomChar = String.fromCharCode(randomCharCode);

      // const randomChar = faker.string.alpha(1);
      data = data.substring(0, addIndex) + randomChar + data.substring(addIndex);
      break;
    case 'swap':
      // Swap near characters (swap i and i+1)
      const swapIndex = Math.floor(random * (data.length - 1));
      data = data.substring(0, swapIndex) + data[swapIndex + 1] + data[swapIndex] + data.substring(swapIndex + 2);
      break;
    default:
      break;
  }

  return data;
}

const getFaker = (region: string) => {
  let faker: Faker;
  switch (region) {
    case REGIONS.US: {
      faker = fakerEN_US;
      break;
    }
    case REGIONS.PL: {
      faker = fakerPL;
      break;
    }
    case REGIONS.ES: {
      faker = fakerES;
      break;
    }
    case REGIONS.JA: {
      faker = fakerJA;
      break;
    }
    default:
      faker = fakerGlobal;
  }
  return faker;
};
class DataGenerator {
  data: Person[] = [];
  oldState = '';
  constructor(state: FormState) {
    const randomizer = generatePureRandRandomizer(+state.seed);
    const faker = getFaker(state.region);
    faker.seed(+state.seed);

    this.data = makeData(faker, randomizer, +state.error, DATA_SIZE);
  };
  getData(): Person[] {
    return this.data;
  }
};
// const gen = ;


//simulates a backend api
export const fetchData = async (
  start: number,
  size: number,
  formState: FormState
) => {
  const gen = new DataGenerator(formState);
  const dbData = [...gen.getData()];

  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    data: dbData.slice(start, start + size),
    meta: {
      totalRowCount: dbData.length,
    },
  };
};
