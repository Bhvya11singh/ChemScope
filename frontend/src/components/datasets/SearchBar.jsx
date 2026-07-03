function SearchBar({
    value,
    onChange
}) {
    return (
        <input
            className="form-control"
            placeholder="Search dataset..."
            value={value}
            onChange={onChange}
        />
    );
}

export default SearchBar;