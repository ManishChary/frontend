import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyShopFormService } from 'src/app/services/my-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit 
{

  checkOutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;  
  creditCardMonths: number []=[];
  creditCardYears: number []=[];

  constructor(private formBuilder: FormBuilder,
    private myShopFormService: MyShopFormService) { }

  ngOnInit(): void 
  {
    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        pinCode:['']
      }),
      billingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        pinCode:['']
      }),
      criditCard: this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:['']
      }),

    })

    //populate credit card months
    const startMonth: number= new Date().getMonth()+1;
    console.log("start month  :"+ startMonth);

    this.myShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Credit card Months: " + JSON.stringify(data));
        this.creditCardMonths=data;
      }
    )

    //populate the credit card years
    this.myShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("credit card Years: "+JSON.stringify(data));
        this.creditCardYears=data;
      }
    )

  }

  copyShippingAddressToBillingAddress(event){
    if(event.target.checked){
      this.checkOutFormGroup.controls['billingAddress']
      .setValue(this.checkOutFormGroup.controls['shippingAddress'].value);
    }
    else{
      this.checkOutFormGroup.controls['billingAddress'].reset();
    }
  }

  onSubmit(){
    console.log("Handling the Purchase button");
    console.log(this.checkOutFormGroup.get('customer').value);
    console.log("Email: "+this.checkOutFormGroup.get('customer').value.email);
  }

  handleMonthsAndYears()
  {
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = creditCardFormGroup.value.expirationYear;

    //if currentyear = the selected year , then start with the current month
    let startmonth: number;

    if(currentYear == selectedYear){
      startmonth = new Date().getMonth()+1;
    }
    else{
      startmonth = 1;
    }
    this.myShopFormService.getCreditCardMonths(startmonth).subscribe(
      data => {
        console.log("Credit card months: " +JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }

}
