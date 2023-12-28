class PossibleArrangementRecord:
    def __init__(self, boxIndex, numberOfUnplacedItems, possibleArrangements):
        self.boxIndex = boxIndex
        self.numberOfUnplacedItems = numberOfUnplacedItems
        self.possibleArrangements = possibleArrangements

def getNumberOfPossibleArrangements(box, items, boxIndex, cache=[]):
    if not items:
        return 1

    while boxIndex < len(box) and box[boxIndex] == '.':
        boxIndex += 1

    if boxIndex >= len(box):
        return 0

    for record in cache:
        if record.boxIndex == boxIndex and record.numberOfUnplacedItems == len(items):
            return record.possibleArrangements

    possibleArrangements = 0

    if checkIfItemCanFit(box, items[0], boxIndex):
        possibleArrangements += placeItem(box, items, boxIndex, cache)

    if box[boxIndex] == '?':
        possibleArrangements += getNumberOfPossibleArrangements(box, items.copy(), boxIndex + 1, cache)

    record = PossibleArrangementRecord(boxIndex, len(items), possibleArrangements)
    cache.append(record)

    return possibleArrangements

def checkIfItemCanFit(box, itemLength, boxIndex):
    if boxIndex + itemLength >= len(box):
        return False

    for i in range(boxIndex, boxIndex + itemLength):
        if box[i] == '#' or (box[i] == '?' and i != boxIndex + itemLength - 1):
            return False

    return True

def placeItem(box, items, boxIndex, cache):
    items_copy = items.copy()
    boxIndex += 1 + items_copy[0]
    items_copy.pop(0)
    return getNumberOfPossibleArrangements(box, items_copy, boxIndex, cache)
