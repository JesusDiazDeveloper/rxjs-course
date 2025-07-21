import { Observable, Observer } from "rxjs";

// This exercise demostrates that if i do not complete the observable, it will keep emitting values
// and the interval will not be cleared, which can lead to memory leaks.

// There are 2 ways to complete an observable:
// 1. By calling the complete method on the OBSERVABLE
//    - this will stop the observable from emitting values and will call the complete method on the
// 2. By returning a function from the observable that will be called when the observable is unsubscribed

const interval$ = new Observable<number>((subscriber) => {
  
  // create a counter that emits a value every second
  let count = 0;

  // i need to save the interval id to clear it later
  const interval = setInterval(() => {
    count++;
    subscriber.next(count);

    // this could be a good way to complete the observable
    // but in this case, i will use the return method of the observable
    // ~ this method is called when the observable is UNSUBSCRIBED
    
    // complete after 5 emissions
    // if (count === 5) {
    //   subscriber.complete(); 
    // }
  }, 1000);

  return () => {
    // this will be called when the observable is unsubscribed
    clearInterval(interval);
    console.log('Observable Unsubscribed, Interval Cleared');
  }

});
 
// An observable.subscribe() method returns a Subscription object
//~ which can be used to unsubscribe from the observable.

const subscription1 = interval$.subscribe();
const subscription2 = interval$.subscribe();
const subscription3 = interval$.subscribe();

setTimeout(() => {
subscription1.unsubscribe()
subscription2.unsubscribe()
subscription3.unsubscribe()
console.log('Timeout Completed, Unsubscribed from all Observers');
}, 3000);