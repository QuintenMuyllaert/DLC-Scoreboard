let debug = false;
const consolelog = console.log;

consolelog("Made with ❤️ by QMA");
if (!debug) {
	consolelog("Debugging is disabled");
}

console.log = function (...args) {
	if (debug) {
		consolelog(...args);
	}
};
