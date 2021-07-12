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
		if (parsed_code.options.player_position) {temp_arr.push(`local ship = pewpew.new_player_ship(${parsed_code.options.player_position[0]}fx, ${parsed_code.options.player_position[1]}fx, 0)`)}
		if (parsed_code.options.shields >= 0) {temp_arr.push(`pewpew.configure_player(0, {shield = ${parsed_code.options.shields}})`)}
		if (parsed_code.options.camera_distance >= -32767) {temp_arr.push(`pewpew.configure_player(0, {camera_distance = ${parsed_code.options.camera_distance}fx})`)}
		if (parsed_code.options.camera_rotation_x_axis >= -32767) {temp_arr.push(`pewpew.configure_player(0, {camera_rotation_x_axis = ${parsed_code.options.camera_rotation_x_axis}fx})`)}
		if (parsed_code.options.move_joystick_color) {temp_arr.push(`pewpew.configure_player(0, {move_joystick_color = 0x${parsed_code.options.move_joystick_color}})`)}
		if (parsed_code.options.shoot_joystick_color) {temp_arr.push(`pewpew.configure_player(0, {shoot_joystick_color = 0x${parsed_code.options.shoot_joystick_color}})`)}
		if (parsed_code.options.cannon_type && parsed_code.options.cannon_frequency) {temp_arr.push(`pewpew.configure_player_ship_weapon(ship, {cannon = pewpew.CannonType.${parsed_code.options.cannon_type.toUpperCase()}, frequency = pewpew.CannonFrequency.${parsed_code.options.cannon_frequency.toUpperCase()}})`)}
		if (parsed_code.options.respawn_enemies) {temp_arr.push(`pewpew.add_update_callback(function()`, `  if pewpew.get_entity_count(pewpew.EntityType.MOTHERSHIP) + pewpew.get_entity_count(pewpew.EntityType.ASTEROID) + pewpew.get_entity_count(pewpew.EntityType.BAF) + pewpew.get_entity_count(pewpew.EntityType.INERTIAC) + pewpew.get_entity_count(pewpew.EntityType.ROLLING_CUBE) + pewpew.get_entity_count(pewpew.EntityType.WARY) + pewpew.get_entity_count(pewpew.EntityType.UFO) + pewpew.get_entity_count(pewpew.EntityType.CROWDER) == 0 then`)}
		//enemy code

		if (parsed_code.options.respawn_enemies) {temp_arr.push(`  end`, `end)`)}
		// join the array of code 
		document.getElementById("codeoutput").innerHTML = temp_arr.join('<br>')
	}
	catch (error){
		// send error if some shit happened
		document.getElementById("codeoutput").innerHTML = `-- ERROR: ${error}`
	}
}