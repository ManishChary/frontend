import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService 
{
 
  cartItems: CartItem[]=[];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem:CartItem)
  {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;
  
    if(this.cartItems.length > 0)
    {
      /*for(let tempCartItem of this.cartItems)
      {
        if(tempCartItem.id == cartItem.id)
        {
          existingCartItem = tempCartItem;

          break;
        }
      }*/
      //same code in different way , instead of that for loop , we use this single line
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id == cartItem.id);

      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart)
    {
      //increment the quantity
      existingCartItem.quantity++;
    }
    else
    {
      //just add the items to array
      this.cartItems.push(cartItem);
    }
  
    //compute cart quantity and cart total

    this.computeCartTotals();
  }
  computeCartTotals() 
  {
    let totalPriceValue: number =0;
    let totalQuantityValue: number = 0;
    
    for(let currentCartItem of this.cartItems)
    {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the values to all subscribers will receive  the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    //log cart data  just debugging purpose

    this.logCartData(totalPriceValue, totalQuantityValue)
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) 
  {
    console.log("Contents of the Cart");
    for(let tempCartItem of this.cartItems)
    {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;

      console.log(`Name: ${tempCartItem.name}, Quantity: ${tempCartItem.quantity} ,
      Unit Price = ${tempCartItem.unitPrice}, SubTotalPrice =${subTotalPrice} `);
    }

// only show the two digits afetr decimal

    console.log(`Total Price : ${totalPriceValue.toFixed(2)},
     Total Quantity : ${totalQuantityValue}`);

    console.log("--------------------------------");
  }


  decrementQuantity(cartItem: CartItem) 
  {
    cartItem.quantity--;
    if(cartItem.quantity == 0)
    {
      this.remove(cartItem);
    }
    else
    {
      this.computeCartTotals();
    }
  }
  remove(cartItem: CartItem) 
  {
   const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id == cartItem.id);
if(itemIndex > -1)
{
  this.cartItems.splice(itemIndex,1);
  this.computeCartTotals();
}

  }
 
}
