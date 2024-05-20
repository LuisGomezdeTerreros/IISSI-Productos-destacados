import { Order, Product, Restaurant } from '../models/models.js'
const checkProductOwnership = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId, { include: { model: Restaurant, as: 'restaurant' } })
    if (req.user.id === product.restaurant.userId) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    }
  } catch (err) {
    return res.status(500).send(err)
  }
}
const checkProductRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurantId)
    if (req.user.id === restaurant.userId) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    }
  } catch (err) {
    return res.status(500).send(err)
  }
}

const checkOnly5DestacadosPost = async (req, res, next) => {
  try {
    if (req.body.destacado === true) {
      const destacdos = await Product.count({ where: { destacado: true, restaurantId: req.body.restaurantId } })
      if (destacdos >= 5) {
        return res.status(403).send('Ya hay 5 productos destacados')
      } else {
        return next()
      }
    } else {
      return next()
    }
  } catch (err) {
    return res.status(500).send(err)
  }
}

const checkOnly5DestacadosUpdate = async (req, res, next) => {
  try {
    if (req.body.destacado === true) {
      const product = await Product.findByPk(req.params.productId)
      
      const destacdos = await Product.count({ where: { destacado: true, restaurantId: product.restaurantId } })
      if (destacdos >= 5) {
        return res.status(403).send('Ya hay 5 productos destacados')
      } else {
        return next()
      }
    } else {
      return next()
    }
  } catch (err) {
    return res.status(500).send(err)
  }
}

const checkProductHasNotBeenOrdered = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId, { include: { model: Order, as: 'orders' } })
    if (product.orders.length === 0) {
      return next()
    } else {
      return res.status(409).send('This product has already been ordered')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export { checkProductOwnership, checkProductRestaurantOwnership, checkProductHasNotBeenOrdered, checkOnly5DestacadosPost, checkOnly5DestacadosUpdate }
