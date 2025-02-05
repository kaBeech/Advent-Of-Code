class PossibleArrangementRecord:
    def __init__(self, boxIndex, numberOfUnplacedItems, possibleArrangements):
        self.boxIndex = boxIndex
        self.numberOfUnplacedItems = numberOfUnplacedItems
        self.possibleArrangements = possibleArrangements

def getNumberOfPossibleArrangements(box, items, boxIndex, cache=[]):
    if not items:
        # Check if the current box section or any section after it is known to be empty
        for i in range(boxIndex, len(box)):
            if box[i] == '#':
                return 0
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
    if boxIndex + itemLength > len(box):
        return False

    for i in range(boxIndex, boxIndex + itemLength):
        if box[i] == '.':
            return False

    if boxIndex + itemLength < len(box) and box[boxIndex + itemLength] == '#':
        return False

    return True

def placeItem(box, items, boxIndex, cache):
    items_copy = items.copy()
    boxIndex += 1 + items_copy[0]
    items_copy.pop(0)
    return getNumberOfPossibleArrangements(box, items_copy, boxIndex, cache)

def parseInputString(input_string):
    box, items_part = input_string.split()
    box = box.strip()

    # Add a '?' character to the end of the box
    box += '?'

    # Add 5 copies of the box to the box string
    box *= 5

    # Remove the final '?' character from the end of the box
    if box[-1] == '?':
        box = box[:-1]

    # Extract the items as an array of numbers by splitting on ','
    items = [int(item) for item in items_part.split(',')]

    # Add 5 copies of the items to the items array
    items *= 5

    return box, items

def main():
    totalPossibleArrangements = 0

    with open("testInput.dat", "r") as file:
        input_strings = file.readlines()

    for input_string in input_strings:
        box, items = parseInputString(input_string)
        arrangements = getNumberOfPossibleArrangements(box, items, 0, [])
        totalPossibleArrangements += arrangements

    return totalPossibleArrangements

result = main()
print("Total Possible Arrangements:", result)


print("Hello, World!!")

# ??? 1
# ???.### 1,1,3
# .??..??...?##. 1,1,3
# ?#?#?#?#?#?#?#? 1,3,1,6
# ????.#...#... 4,1,1
# ????.######..#####. 1,6,5
# ?###???????? 3,2,1

testResult = getNumberOfPossibleArrangements("#?#", [1], 0, [])
print(testResult)
testResult = getNumberOfPossibleArrangements("???.###", [1,1,3], 0, [])
print(testResult)
testResult = getNumberOfPossibleArrangements(".??..??...?##.", [1,1,3], 0, [])
print(testResult)
testResult = getNumberOfPossibleArrangements("?#?#?#?#?#?#?#?", [1,3,1,6], 0, [])
print(testResult)
testResult = getNumberOfPossibleArrangements("????.#...#...", [4,1,1], 0, [])
print(testResult)
testResult = getNumberOfPossibleArrangements("????.######..#####.", [1,6,5], 0, [])
print(testResult)
testResult = getNumberOfPossibleArrangements("?###????????", [3,2,1], 0, [])
print(testResult)
