function compareString(first, second) {
    first = first.toLowerCase();
    second = second.toLowerCase();
  
    return (first < second) ? -1 : (first > second) ? 1 : 0;
}

export default compareString;