let store = {
  deliveries: [],
  meals: [],
  employers: [],
  customers: [],
  trips: [],
  drivers: [],
  passengers: []
}

let deliveryId = 0

class Delivery {
  constructor(meal, customer) {
    this.id = ++deliveryId
    if (meal && customer) {
      this.mealId = meal.id
      this.customerId = customer.id
    }
    store.deliveries.push(this)
  }
  customer(){
    return store.customers.find(customer => {return customer.id === this.customerId})
  }
  meal(){
    return store.meals.find(meal => {return meal.id === this.mealId})
  }
}

let mealId = 0

class Meal {
  constructor(title, price) {
    this.id = ++mealId
    this.title = title
    this.price = price
    store.meals.push(this)
  }
  static byPrice() {
    return store.meals.sort(function (a,b) {return (b.price - a.price)})
  }
  deliveries() {
    return store.deliveries.filter(delivery => {return delivery.mealId === this.id})
  }
  customers() {
    return this.deliveries().map(delivery => {return store.customers.find(customer => {return customer.id === delivery.customerId})})
  }
}

let employerId = 0

class Employer {
  constructor(name){
    this.id = ++employerId
    this.name = name
    store.employers.push(this)
  }
  employees() {
    return store.customers.filter(customer => {return customer.employerId === this.id})
  }
  deliveries() {
    return this.employees().map(employee => {return store.deliveries.find(delivery => {return delivery.customerId === employee.id})})
  }
  allmeals(){
    return this.deliveries().map(delivery => {return store.meals.find(meal => {return meal.id === delivery.mealId})})
  }
  meals() {
    return [...new Set(this.allmeals())]
  }
  mealTotals() {
    let counts = {}
    let meals = store.deliveries.map(delivery => {return store.meals.find(meal => {return meal.id === delivery.mealId})})
    meals.forEach(function(meal){
      counts[meal.id] = (counts[meal.id] || 0) + 1
    })
    return counts
  }
}

let customerId = 0

class Customer {
  constructor(name, employer){
    this.id = ++customerId
    if (employer) {
      this.employerId = employer.id
    }
    this.name = name
    store.customers.push(this)
  }
  totalSpent() {
    let meals = store.deliveries.filter(delivery => {return delivery.customerId === this.id}).map(delivery => {return store.meals.find(meal => {return meal.id === delivery.mealId})})
    return meals.reduce((function (agg, meal, i, meals) {return agg + meal.price}), 0)
  }
  deliveries() {
    return store.deliveries.filter(delivery => {return delivery.customerId === this.id})
  }
  meals() {
    return this.deliveries().map(delivery => {return store.meals.find(meal => {return meal.id === delivery.mealId})})
  }
}

let passengerId = 0

class Passenger {
  constructor(name){
    this.id = ++passengerId
    this.name = name
    store.passengers.push(this)
  }
  trips() {
    return store.trips.filter(trip => {return trip.passengerId === this.id})
  }
  drivers() {
    return this.trips().map(trip => {return store.drivers.find(driver => {return driver.id === trip.driverId})})
  }
}

let driverId = 0

class Driver {
  constructor(name){
    this.id = ++driverId
    this.name = name
    store.drivers.push(this)
  }
  trips() {
    return store.trips.filter(trip => {return trip.driverId === this.id})
  }
  passengers() {
    return this.trips().map(trip => {return store.passengers.find(passenger => {return passenger.id === trip.passengerId})})
  }
}

let tripId = 0

class Trip {
  constructor(driver, passenger) {
    this.id = ++tripId
    this.driverId = driver.id
    this.passengerId = passenger.id
    store.trips.push(this)
  }

  passenger() {
    return store.passengers.find(passenger => {return passenger.id === this.passengerId})
  }
  driver() {
    return store.drivers.find(driver => {return driver.id === this.driverId})
  }
}
