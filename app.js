/*
 * My shitty PewPewJson compiler
 * Copyright (c) 2021 Dominykas M. (Tasty Kiwi)
 * Licensed under MIT license
 */

function compile() {
	// some prep code 
	const raw_code = document.getElementById("codearea").value 
	let temp_arr = ["-- this file was created by pewpewjson compiler\n"]

	try {
		// if no text, throw an exception
		if (!raw_code) {throw "Did you forget to put something in?"}
		
		// convert json to js object
		const parsed_code = JSON.parse(raw_code)

		// convert objects into lua code
		if (parsed_code.options.level_size) {temp_arr.push(`pewpew.set_level_size(${parsed_code.options.level_size[0]}fx, ${parsed_code.options.level_size[1]}fx)`)}
		if (parsed_code.options.player_location) {temp_arr.push(`local ship = pewpew.new_player_ship(${parsed_code.options.player_location[0]}fx, ${parsed_code.options.player_location[1]}fx, 0)`)}
		if (parsed_code.options.shield_amount >= 0) {temp_arr.push(`pewpew.configure_player(0, {shield = ${parsed_code.options.shield_amount}})`)}

		// join the array of code 
		document.getElementById("codeoutput").innerHTML = temp_arr.join('\n')
	}
	catch (error){
		// send error if some shit happened
		document.getElementById("codeoutput").innerHTML = `-- ERROR: ${error}`
	}
}