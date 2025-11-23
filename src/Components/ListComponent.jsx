function ListComponent({ items }) {
    return (
        <div className="list">
            {items.map((item, index) => (
                <div className="list-item" key={index}>
                    <img src={item.imagePath} alt={item.title}
                        className="item-image" />
                    <div className="item-text">
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ListComponent;