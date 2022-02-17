const Booking = require('./models/Booking')
const Listing = require('./models/Listing')
const User = require('./models/User')

exports.resolvers = {
    Query: {
        login: async (parent, args) => {
            let user = await User.findOne({$and: [{username: args.username}, {password: args.password}]})
            if (!user) {
                throw new Error("User and Password Didn't match")
            }
            if (user.type == 'admin') {
                return { secret: process.env.SECRET_ADMIN }
            } else {
                return { secret: process.env.SECRET_USER }
            }
        },
        getAllUserBooking: async (parent, args) => {
            let bookings = []
            if (args.username) {
                if (args.secret == process.env.SECRET_USER) {
                    bookings = await Booking.find({username: args.username})
                } else {
                    throw new Error("Must be logged in as user to see this")
                }
            } else {
                if (args.secret == process.env.SECRET_ADMIN) {
                    bookings = await Booking.find({})
                } else {
                    throw new Error("Must be logged in as Admin User to see this")
                }
            }
            return bookings
        },
        getAllAdminListings: async (parent, args) => {
            if (args.secret == process.env.SECRET_ADMIN) {
                return await Listing.find({})
            } else {
                throw new Error("Must be logged in as Admin User to see this")
            }
        },
        searchListingByName: async (parent, args) => {
            return await Listing.find(args)
        },
        searchListingByCity: async (parent, args) => {
            return await Listing.find(args)
        },
        searchListingByPostalCode: async (parent, args) => {
            return await Listing.find(args)
        },

    },

    Mutation: {
        createUser: async (parent, args) => {
            let user = new User(args)
            return user.save()
        },
        createListing: async (parent, args) => {
            if (args.secret == process.env.SECRET_ADMIN) {
                let listing = new Listing(args)
                return listing.save()
            }
            throw new Error("Authentication Failed, please make sure you include your secret in your request.")
        },
        createBooking: async (parent, args) => {
            if (args.secret == process.env.SECRET_ADMIN) {
                let booking = new Booking(args)
                return booking.save()
            }
            throw new Error("Authentication Failed, please make sure you include your secret in your request.")
        }
    }
}