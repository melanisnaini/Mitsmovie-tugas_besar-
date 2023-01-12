import { Card } from "react-bootstrap"

const Trending = () => {
    return (
        <div>
            <Card className="bg-dark text-white">
              <Card.Img src="holder.js/100px270" alt="Card Image"  />
              <Card.ImgOverlay>
                 <Card.Title>Card Title</Card.Title>
                 <Card.Text>

                 </Card.Text>
                 <Card.Text>Last updated 3 mins ago</Card.Text>
              </Card.ImgOverlay>
            </Card>
        </div>
    )
}

export default Trending