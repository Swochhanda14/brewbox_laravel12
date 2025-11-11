import { Helmet } from "react-helmet-async"

const Meta = ({title,description,keywords}) => {
  return (
    <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    </Helmet>
  )
}

// Meta.defaultProps = {
//     title:'BrewBox',
//     description:'Welcome to BrewBox, your one-stop shop for all things coffee! Discover a wide range of premium coffee beans to elevate your coffee experience.',
//     keywords:'coffee, coffee beans, BrewBox'
// }

export default Meta
