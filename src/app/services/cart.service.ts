import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0); 
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // storage:Storage = sessionStorage;
  storage:Storage = localStorage;

  constructor() { 

    //read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null){
      this.cartItems = data;

      //compute totals based on the data that is read from storage
      this.computeCartTotal();
    }
  }

  addToCart(thecartItem: CartItem){

    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if(this.cartItems.length > 0) {
      //find item in the cart based on item id

      // for (let tempCartItem of this.cartItems){
      //   if(tempCartItem.id === thecartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }  //refactored

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === thecartItem.id);

      //check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      //increment the quantity
      existingCartItem!.quantity++;
    } else {
      //just add the item to the array
      this.cartItems.push(thecartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotal();
  }

  computeCartTotal() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publich the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    //persist cart data
    this.persistCartItems();
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);

    for (let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`)
    }
    
    console.log(`totalPrice:${totalPriceValue.toFixed(2)}, totalQuantity=${totalQuantityValue}`);
    console.log("-----");
  }

  decrementQuantity(thecartItem: CartItem) {
    thecartItem.quantity--;

    if(thecartItem.quantity === 0){
      this.remove(thecartItem)
    } else {
      this.computeCartTotal()
    }
  }

  remove(thecartItem: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === thecartItem.id);

    //if found, remove the item from the array at index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotal();
    }
  }
}
