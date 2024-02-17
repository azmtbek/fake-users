import {
  Faker,
  Randomizer,
  fakerPL, fakerES, fakerEN_US,
  faker as fakerGlobal,
  fakerJA
} from '@faker-js/faker';
import { FormState } from './page';
import { REGIONS, DATA_SIZE } from './consts';
import { RandomGenerator, xoroshiro128plus } from 'pure-rand';
import { errorMaker } from './error-maker';


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


const newPerson = (faker: Faker, index: number): Person => {
  return {
    id: index + 1,
    uuid: faker.string.uuid(),
    fullName: faker.person.firstName() + ' ' + faker.person.middleName() + ' ' + faker.person.lastName(),
    address: faker.location.streetAddress(true),
    phone: faker.phone.number(),
  };
};

export const makeData = (faker: Faker, ...lens: number[]) => {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((d): Person => {
      return {
        ...newPerson(faker, d),
      };
    });
  };

  return makeDataLevel();
};

export const generatePureRandRandomizer = (
  seed: number | number[] = Date.now() ^ (Math.random() * 0x100000000),
  factory: (seed: number) => RandomGenerator = xoroshiro128plus
): Randomizer => {
  const self = {
    next: () => (self.generator.unsafeNext() >>> 0) / 0x100000000,
    seed: (seed: number | number[]) => {
      self.generator = factory(typeof seed === 'number' ? seed : seed[0]);
    },
  } as Randomizer & { generator: RandomGenerator; };
  self.seed(seed);
  return self;
};



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
  constructor(state: FormState) {
    const randomizer = generatePureRandRandomizer(+state.seed);
    const faker = getFaker(state.region);
    faker.seed(+state.seed);

    this.data = makeData(faker, DATA_SIZE);
    this.data = errorMaker(+state.error, faker, state.region, this.data);
  };
  getData(): Person[] {
    return this.data;
  }
};


export const fetchData = async (
  start: number,
  size: number,
  formState: FormState
) => {
  const gen = new DataGenerator(formState);
  const dbData = [...gen.getData()];

  // to show that is fetching chunks of data
  await new Promise(resolve => setTimeout(resolve, 250));

  return {
    data: dbData.slice(start, start + size),
    meta: {
      totalRowCount: dbData.length,
    },
  };
};
