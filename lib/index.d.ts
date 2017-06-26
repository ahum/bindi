export interface Result {
    markup: string;
    bindings: any[];
}
export default function (rawMarkup: string, el: HTMLElement): Result;
