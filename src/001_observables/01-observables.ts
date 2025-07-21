
import { Observable, Observer } from "rxjs";

const obs$ = new Observable<string>((subscriber) => {
  subscriber.next("Hello, World!");
subscriber.next("a second value");

// forcing an error
// if an error occurs, the observable will stop emitting values
// anything after the error will not be executed!
// const something = undefined;
// something.name = "test"; // This will throw an error

  subscriber.complete();
});

// This way of subscribing is deprecated, 
// is better to use an object with next, error and complete methods
obs$.subscribe(
    someValue => console.log(someValue),
    error => console.warn(error),
    () => console.log("Observable called Complete Method")
);

obs$.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("Second subscriber Completed"),
});

const observerObj : Observer<string> = {
  next: (value) => console.log(value),
  error: (err) => console.warn(err),
  complete: () => console.log("Third Observer completed")
}

obs$.subscribe(observerObj);