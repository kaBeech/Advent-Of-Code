def process_input_from_file(filename="challengeInput.txt"):
    # Read input from file
    with open(filename, 'r') as file:
        input_str = file.read()

    # Split input into lines
    lines = input_str.strip().split('\n')

    # Declare arrays
    scratchcards = []

    for line in lines:
        # Extract card_id (number before the colon)
        card_id_str, rest_of_line = line.split(':')
        scratchcard_id = int(card_id_str.split()[-1])

        # Extract winning_numbers and my_numbers
        winning_numbers = list(map(int, rest_of_line.split('|')[0].split()))
        my_numbers = list(map(int, rest_of_line.split('|')[1].split()))

        # Calculate shared_numbers
        shared_numbers = len(set(winning_numbers) & set(my_numbers))

        # Create scratchcard
        scratchcard = {'id': scratchcard_id, 'shared_numbers': shared_numbers,
                       'winning_numbers': winning_numbers, 'my_numbers': my_numbers}
        scratchcards.append(scratchcard)

    # Process scratchcards
    original_scratchcards_count = len(scratchcards)
    for i in range(original_scratchcards_count):
        scratchcard = scratchcards[i]
        for j in range(1, scratchcard['shared_numbers'] + 1):
            # Add copies of scratchcards with sequential id's
            new_scratchcard = scratchcards[i + j].copy()
            scratchcards.append(new_scratchcard)

    # Return the total number of scratchcards
    return len(scratchcards)


# Call the function to process input from the file
result = process_input_from_file()
print(result)
