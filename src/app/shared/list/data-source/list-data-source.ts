import { BehaviorSubject, map, Observable } from 'rxjs';

export class ListDataSource<T extends Record<string, any>> {

  #filter: BehaviorSubject<string> = new BehaviorSubject('');
  #data: BehaviorSubject<T[]> = new BehaviorSubject([] as T[]);
  #filteredData: BehaviorSubject<T[]> = new BehaviorSubject([] as T[]);

  constructor(data: T[]) {
    this.#data.next(data);
    this.#filteredData.next(data);
  }

  get filter(): string {
    return this.#filter.getValue();
  }

  get data(): T[] {
    return this.#data.getValue();
  }

  get filteredData(): T[] {
    return this.#filteredData.getValue();
  }

  set filter(value: string) {
    this.onFilterChange(value);
  }

  set data(value: T[]) {
    this.onDataChange(value);
  }

  set filteredData(value: T[]) {
    this.#filteredData.next(value);
  }

  public connect(): Observable<T[]> {
    return this.#filteredData.asObservable().pipe(map((data: T[]) => {
      return this.sort(data);
    }));
  }

  /**compare of top level fields value with filter */
  public filterPredicate(data: T, filter: string): boolean {
    const keys: string[] = Object.keys(data);
    let testedValue: string = keys.reduce((currentTerm: string, key: string) => {
      currentTerm = currentTerm.concat(data[key] + '◬');
      return currentTerm.toLowerCase();
    }, '');

    return testedValue.includes(filter.trim().toLowerCase());
  }

  public sort(data: T[]): T[] {
    return data;;
  }

  private onDataChange(data: T[]): void {
    this.#data.next(data);
    let filteredData: T[] = [];

    if (data.length !== 0) {
      filteredData = this.getFilteredData();
    }

    this.#filteredData.next(filteredData);
  }

  private onFilterChange(filterValue: string) {
    this.#filter.next(filterValue);

    let filteredData: T[] = [];

    if (this.data.length !== 0) {
      filteredData = this.getFilteredData();
    }

    this.#filteredData.next(filteredData);
  }

  private getFilteredData(): T[] {
    const filteredItems: Set<T> = new Set();
    const data: T[] = this.data;
    let returnData: T[] = [];

    if (null === this.filter || '' === this.filter) {
      returnData = data;
    } else {
      this.filteredData.forEach((dataItem: T) => {
        if (this.filterPredicate(dataItem, this.filter)) {
          filteredItems.add(dataItem);
        }
      });

      returnData = Array.from(filteredItems);
    }



    return returnData;
  }
}