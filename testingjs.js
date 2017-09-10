function patchKind(classid, data, kind) {

	var requestTeachersURL;
	var requestTeachers;

	requestTeachersURL = 'http://127.0.0.1:5000/api/classes/' + classid + '/' + kind;
	requestTeachers = new XMLHttpRequest();
	requestTeachers.open('PATCH', requestTeachersURL, true);
	requestTeachers.setRequestHeader("Content-type", "application/json");
	requestTeachers.send(JSON.stringify(data));
	requestTeachers.onreadystatechange = function () {
		if (requestTeachers.readyState === 4 && requestTeachers.status === 200) {
			console.log("SentKind:" + kind);
		} else {
			console.log(requestTeachers.readyState);
		}
	};
}
