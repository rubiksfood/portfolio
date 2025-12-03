import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import faCheckSquare from '@fortawesome/fontawesome-free-regular/faCheckSquare';
import faSquare from '@fortawesome/fontawesome-free-regular/faSquare';

export function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const toggleChecked = () => {
        fetch(`http://localhost:5050/shopItem/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name, // Is necessary/applicable?
                isChecked: !item.isChecked,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => r.json())
            .then(onItemUpdate);
    };

    const removeItem = () => {
        fetch(`http://localhost:5050/shopItem/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    return (
        <Container fluid className={`item ${item.isChecked && 'completed'}`}>
            <Row>
                <Col xs={2} className="text-center">
                    <Button
                        className="toggles"
                        size="sm"
                        variant="link"
                        onClick={toggleChecked}
                        aria-label={
                            item.isChecked
                                ? 'Mark item as incomplete'
                                : 'Mark item as complete'
                        }
                    >
                        <FontAwesomeIcon
                            icon={item.isChecked ? faCheckSquare : faSquare}
                        />
                        <i
                            className={`far ${
                                item.isChecked ? 'fa-check-square' : 'fa-square'
                            }`}
                        />
                    </Button>
                </Col>
                <Col xs={8} className="name">
                    {item.name}
                </Col>
                <Col xs={2} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        aria-label="Remove Item"
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            className="text-danger"
                        />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

ItemDisplay.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        isChecked: PropTypes.bool,
    }),
    onItemUpdate: PropTypes.func,
    onItemRemoval: PropTypes.func,
};
