import { Faker, en_US, pl, } from '@faker-js/faker';
import { ColumnSort, SortingState } from '@tanstack/react-table';

const faker = new Faker({ locale: [pl] });


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

const newPerson = (index: number): Person => {
  return {
    id: index + 1,
    uuid: faker.string.uuid(),
    fullName: faker.person.fullName(),
    address: faker.location.streetAddress(true),
    phone: faker.phone.number(),
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((d): Person => {
      return {
        ...newPerson(d),
      };
    });
  };

  return makeDataLevel();
}

const data = makeData(1000);

//simulates a backend api
export const fetchData = async (
  start: number,
  size: number,
  sorting: SortingState
) => {
  const dbData = [...data];
  if (sorting.length) {
    const sort = sorting[0] as ColumnSort;
    const { id, desc } = sort as { id: keyof Person; desc: boolean; };
    dbData.sort((a, b) => {
      if (desc) {
        return a[id] < b[id] ? 1 : -1;
      }
      return a[id] > b[id] ? 1 : -1;
    });
  }

  //simulate a backend api
  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    data: dbData.slice(start, start + size),
    meta: {
      totalRowCount: dbData.length,
    },
  };
};
