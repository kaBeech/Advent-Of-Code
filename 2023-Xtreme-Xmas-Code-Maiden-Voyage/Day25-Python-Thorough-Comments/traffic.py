from component import Component
from random import choice as random_choice
from component import get_component_by_id
from connection import get_connection_by_component_ids
from list_includes import list_includes_string

def simulate_traffic(components, connections):

    print("Simulating traffic...")
    
    # Simulate random paths until the hottest connection has a heat value 
    #   that is greater than 100 and the 3rd hottest connection has at least 
    #   double that of the 4th hottest component
    while connections[0].heat <= 100 or connections[2].heat <= 1.5 * connections[3].heat:

        # Simulate a random path
        simulate_random_traffic_path(components, connections)

        # I was going to use a to reduce sorting, but I'm not that familiar with 
        #   heaps in python and my preliminary testing yielded errors when using 
        #   duplicate priority values, so we'll just sort by heat for now
        connections.sort(key=lambda connection: connection.heat, reverse=True)
    
    print("...Traffic Simulation Complete")

     
def simulate_random_traffic_path(components, connections):
    # print("Simulating random traffic path...")
    
    # Randomly choose starting and ending components
    component_start_id = random_choice(components).id
    component_end_id = random_choice(components).id

    # If the starting and ending components are the same, choose a new ending
    while component_start_id == component_end_id:
        component_end_id = random_choice(components).id

    # Find a path from the starting component to the ending component
    path = find_path(component_start_id, component_end_id, components, connections)

    # Increment the heat of each component in the path
    for component in path:
        if component.previous is not None:
            connection = get_connection_by_component_ids(component.id, component.previous, connections)
            if connection is None:
                raise ReferenceError("Connection between", component.id, "and", component.previous, "not found", connections)
            else:
                connection.heat += 1
    
    # print("...Random Traffic Path Simulation Complete")

def find_path(component_start_id, component_end_id, components, connections):
    
    # print("Finding path...")

    log_hottest = True
    for component in components:
        component.previous = None

    # Initialize the list of visited components
    visited = []

    # Initialize the list of unvisited components
    unvisited = []

    # Add the starting component to the list of unvisited components
    unvisited.append(component_start_id)

    # This is based on Dijsktra's algorithm because I'm comfortable with it, but I 
    #   don't actually care about finding the shortest path, just any path, so it 
    #   terminates after finding the first path
    path_found = False
    while not path_found:
        # print(visited)

        if not unvisited:
            last_visited = get_component_by_id(visited[-1], components)
            raise KeyError(f"No path found from {component_start_id} to {component_end_id}. Visited Components: {visited}. Last Visited Component: {last_visited}")


        current_component_id = unvisited.pop(0)
        current_component = get_component_by_id(current_component_id, components)
        
        if current_component is None:
            raise KeyError("Current component", current_component_id, "not found")

        # Add the current component to the list of visited components
        if list_includes_string(visited, current_component.id):
            raise ValueError(f"Component {current_component.id} already visited")
        else: 
            visited.append(current_component.id)

        # If the current component is the ending component, set path_found to 
        #   True and break
        if current_component.id == component_end_id:
            path_found = True
            break
        
        if len(current_component.connected_components) == 0:
            raise ValueError(f"Component {current_component.id} has no connected components")
       

        # For each connection of the current component
        for component_id in current_component.connected_components:
            # Get the connected component
            connected_component = get_component_by_id(component_id, components)
            # print(connected_component)
            if connected_component is None:
                raise KeyError("Connected component", component_id, "not found")
            # Skip this component if it's already in a queue
            elif list_includes_string(visited, connected_component.id):
                log_hottest = False
                # print(f"Skipping {connected_component.id} because it exists in {visited}")
            elif list_includes_string(unvisited, connected_component.id):
                log_hottest = False
                # print(f"Skipping {connected_component.id} because it exists in {unvisited}")
            elif connected_component.previous is not None:
                log_hottest = False
                # print(f"Skipping {connected_component.id} because it has already has a previous value")
            else:
                # Make a linked list of components
                connected_component.previous = current_component.id

                # Add the connected component to the list of unvisited components
                unvisited.append(connected_component.id)

    # print("...Path found...")

    # Initialize the list of connections in the path
    path = []

    # Get the path from the ending component to the starting component
    component_end = get_component_by_id(component_end_id, components)
    if component_end is None:
        raise KeyError("Component end", component_end_id, "not found")
    else:
        current_component = component_end
        while current_component is not None:
            # print("Setting path...", len(path), "Current component:", current_component, "Ending component:", component_end_id, "Visited:", visited)
            path.insert(0, current_component)
            if current_component.previous is None:
                current_component = None
                break
            previous_component = get_component_by_id(current_component.previous, components)
            if previous_component is None:
                raise KeyError("Previous component", current_component.previous, "not found")
            current_component = previous_component

    # print("...Pathfinding Complete")
    if connections[0].heat % 10 == 0:
        log_hottest = True
    if log_hottest:
        print("Top 5 hottest connection heats:", [connection.heat for connection in connections[:5]])
    # Return the path
    return path
