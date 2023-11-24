import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Tabs from '../Tabs'
import DishItem from '../DishItem'
import './index.css'

class Home extends Component {
  state = {
    isLoading: true,
    data: [],
    activeTab: '',
    cartDishes: [],
  }

  componentDidMount() {
    this.makeApiCall()
  }

  makeApiCall = async () => {
    const url = 'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'

    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      const updatedData = data.map(item => item.table_menu_list)
      const newData = updatedData.flat(1)
      const updatedTabs = newData.map(item => item.menu_category)
      this.setState({
        data: newData,
        isLoading: false,
        activeTab: updatedTabs[0],
      })
    }
  }

  setActiveTab = tabDetails => {
    this.setState({
      activeTab: tabDetails.menu_category,
    })
  }

  renderContent = () => {
    const {data, activeTab} = this.state

    const dishes = data.find(item => item.menu_category === activeTab)

    return (
      <>
        <ul className="tabs-container">
          {data.map(item => (
            <Tabs
              key={item.menu_category_id}
              details={item}
              setActiveTab={this.setActiveTab}
              isActive={activeTab === item.menu_category}
            />
          ))}
        </ul>

        <ul className="dishes-container">
          {dishes.category_dishes.map(item => (
            <DishItem
              key={item.dish_id}
              details={item}
              addItemToCart={this.addItemToCart}
              removeItemFromCart={this.removeItemFromCart}
            />
          ))}
        </ul>
      </>
    )
  }

  removeItemFromCart = dishId => {
    const {cartDishes} = this.state

    const itemIndex = cartDishes.indexOf(dishId)

    if (itemIndex !== -1) {
      const updatedDataCart = cartDishes.splice(itemIndex, 1)
      this.setState({cartDishes})
    }
  }

  addItemToCart = dishId => {
    this.setState(prevState => ({
      cartDishes: [...prevState.cartDishes, dishId],
    }))
  }

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="TailSpin" width={50} height={50} />
    </div>
  )

  renderPageContent = () => {
    const {cartDishes} = this.state
    return (
      <>
        <Header cartDishes={cartDishes} />
        <div className="home-container">
          <div className="home-responsive-container">
            {this.renderContent()}
          </div>
        </div>
      </>
    )
  }

  render() {
    const {isLoading} = this.state

    return isLoading ? this.renderLoader() : this.renderPageContent()
  }
}

export default Home
