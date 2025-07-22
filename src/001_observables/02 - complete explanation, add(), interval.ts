import { Observable, Observer } from "rxjs";
import { addSyntheticLeadingComment } from "typescript";

// This exercise demonstrate that if i do not complete the observable, it will keep emitting values
// and the interval will not be cleared, which can lead to memory leaks.

// There are 2 ways to complete an observable:
// 1. By calling the complete method on the OBSERVABLE
//    - this will stop the observable from emitting values and will call the complete method on the
// 2. By returning a function from the observable that will be called when the observable is unsubscribed


const observerObj : Observer<number> = {
  next: (value) => console.log('from observer: ' +value),
  error: (err) => console.warn(err),
  complete: () => console.log("Third Observer completed")
}

{
const interval$ = new Observable<number>((subscriber) => {
  
  // create a counter that emits a value every second
  let count = 0;

  // i need to save the interval id to clear it later
  const interval = setInterval(() => {
    count++;
    subscriber.next(count);
    console.log(`Emitted Value in Interval 1: ${count}`);
    // this could be a good way to complete the observable
    // but in this case, i will use the return method of the observable
    // ~ this method is called when the observable is UNSUBSCRIBED
    
    // complete after 5 emissions
    // if (count === 5) {
    //   subscriber.complete(); 
    // }
  }, 7000);



   const interval2 = setInterval(() => {
    count++;
    subscriber.next(count);
    console.log(`Emitted Value in Interval 2: ${count}`);

    // this could be a good way to complete the observable
    // but in this case, i will use the return method of the observable
    // ~ this method is called when the observable is UNSUBSCRIBED
    
    // complete after 5 emissions
    // if (count === 5) {
    //   subscriber.complete(); 
    // }
  }, 3000);

  setTimeout(() => {
    // this will be called after 3 seconds
    // and will complete the observable
    subscriber.complete();
    console.log('Observable Completed');
  }, 10000);

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
const subscription4 = interval$.subscribe(observerObj);





setTimeout(() => {
  subscription1.unsubscribe()
  subscription2.unsubscribe()
  subscription3.unsubscribe()
console.log('Timeout Completed, Unsubscribed from all Observers');
}, 3000);


// The .add() method in an RxJS Subscription allows you 
// to link one subscription to another, 
// creating a parent-child relationship. 
// When the parent subscription is unsubscribed, 
// all its linked (child) subscriptions are automatically 
// unsubscribed as well.
// in place to subscribe separately to each observer,
// i can use the add method to link the subscriptions together
// Ej:
// ~subscription1.add(subscription2)
//               .add(subscription3);

//This way, when i unsubscribe from subscription1,
// it will automatically unsubscribe from subscription2 and subscription3 as well.
//~ subscription1.unsubscribe();

}

// Note: Unsubscribing from an observable will not complete the observable.
// It will just stop the observer from receiving values.

// If you want to complete the observable, you need to call the complete method on the observable.
// or the observable should have the return method that will be called when the observable is unsubscribed.



// Note: Complete method just stops the observable from emitting values.
// It does not clear the interval or any other resources used by the observable.
// If you want to clear the interval or any other resources used by the observable,
// you need to return a function from the observable that will be called when the observable is unsubscribed.

// As i have shown in the example above, when the observable make the complete method,
// the next() calls will not be registered for any observer that is subscribed to the observable.
// But the Interval will still be running until the observable is unsubscribed or the interval is cleared. 

// THE COMPLETE METHOD JUST STOPS THE EMISSION OF VALUES. 
// it's necessary to take this into account when working with observables.

// IMPORTANT:
// Last note: 
// If you complete the observable, it automatically calls 
// the return method if it is defined. 
// (in this case, it will clear the interval 1, BUT not interval 2, 
// because the clearInterval for the second interval 
// is not defined in the return method of the observable)



