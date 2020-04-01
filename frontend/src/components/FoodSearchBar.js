import React from 'react'
import axios from 'axios'
import FoodSearchForm from './FoodSearchForm'
import { Link } from 'react-router-dom'
import auth from '../lib/auth'
import Spinner from './Spinner'
import Hero from './Hero'
class FoodSearchBar extends React.Component {
  constructor() {
    super()
    this.state = {
      query: '',
      parsed: [
        {
          food: {
            nutrients: {}
          }
        }
      ],
      submitted: false
    }
  }

  handleChange(event) {
    const query = event.target.value
    this.setState({ query })
  }


  handleSubmit(event) {

    event.preventDefault()
    setTimeout(() => {
      axios.get(`https://api.edamam.com/api/food-database/parser?ingr=${this.state.query}&app_id=456922e8&app_key=ab36bb266c8b99d0bfedb91299cf6bf3`)
        .then(res => {
          console.log(res.data)
          this.setState({ parsed: res.data.parsed, submitted: true })
        })
        .catch(err => console.error(err))
    }, 1000)
  }



  render() {

    if (!this.state.query) {

      return <>
        <Hero />
        <section className="section">
          <div className="container">
            <FoodSearchForm
              handleChange={(event) => this.handleChange(event)}
              handleSubmit={(event) => this.handleSubmit(event)}
              query={this.state.query}
            />
            <Spinner />
          </div>
        </section>
      </>
    } else {
      const isLoggedIn = auth.isLoggedIn()

      return <>
      <Hero />
      <section className="section">
        <div className="container">
          <FoodSearchForm
            handleChange={(event) => this.handleChange(event)}
            handleSubmit={(event) => this.handleSubmit(event)}
            query={this.state.query}
          />
          <div className="food-card">

            {!this.state.submitted ? null : this.state.parsed.map((parse, key) => {
              return <div key={key}>
                <h4>{parse.food.label}</h4>
                <img src={parse.food.image} alt={parse.food.label} />
                <p className="nutrients">Calories: {parse.food.nutrients.ENERC_KCAL}kcal</p>
                <p className="nutrients">Protein: {parse.food.nutrients.PROCNT}g</p>
                <p className="nutrients">Carbohydrates: {parse.food.nutrients.CHOCDF}g</p>
                <p className="nutrients">Fat: {parse.food.nutrients.FAT}g</p>
                <p className="nutrients">Fiber: {parse.food.nutrients.FIBTG}g</p>
                {isLoggedIn && <button>
                  <Link to={'/shoppinglist'}>
                    Go to Shopping List
                  </Link>
                </button>}
              </div>
            })
            }



          </div>
        </div>
      </section>
      </>
    }
  }
}
// }

export default FoodSearchBar