'use strict';  

function coursesFilter() {

    const predicateArrays = [];
    predicateArrays[0] = [];
    predicateArrays[1] = [];
    predicateArrays[2] = [];
    predicateArrays[3] = [];

    var elems;

    // Periods
    elems = document
        .getElementById('periodcheckboxes')
        .children;
    Array
        .from(elems)
        .forEach(function (elem) {
            const checkbox = elem.children[0];
            if (checkbox.checked) {
                const key = checkbox.getAttribute('data-period');
                predicateArrays[0].push(function (course) {
                    return course[key];
                });
            }
        });

    // Programs
    elems = document
        .getElementById('programcheckboxes')
        .children;
    Array
        .from(elems)
        .forEach(function (elem) {
            const checkbox = elem.children[0];
            if (checkbox.checked) {
                const key = elem
                    .children[1]
                    .textContent;
                predicateArrays[1].push(function (course) {
                    var result = false;

                    course
                        .coursefacts
                        .forEach(function (facts) {
                            if (facts.name == key) {
                                result = true;
                            }
                        });

                    return result;
                });
            }
        });

    

    elems = document
        .getElementById('yearcheckboxes')
        .children;
    Array
        .from(elems)
        .forEach(function (elem) {
            const checkbox = elem.children[0];
            if (checkbox.checked) {
                const key = elem
                    .children[1]
                    .textContent;
                predicateArrays[2].push(function (course) {
                    var result = false;

                    course
                        .coursefacts
                        .forEach(function (facts) {
                            if (facts.year == key) {
                                result = true;
                            }
                        });

                    return result;
                });
            }
        });

        // Periods
    elems = document
        .getElementById('departmentcheckboxes')
        .children;
    Array
        .from(elems)
        .forEach(function (elem) {
            const checkbox = elem.children[0];
            if (checkbox.checked) {
                const key = checkbox.getAttribute('data-department');
                predicateArrays[3].push(function (course) {
                    return course.department === key;
                });
            }
        });

    databases
        .courses
        .forEach(function (course) {
            var results = [];

            predicateArrays.forEach(function (predicates) {
                var result = false;

                predicates.forEach(function (predicate) {
                    if (predicate(course)) {
                        result = true;
                    }
                });

                results.push(result);
            });

            var visible = true;
            course.show = true;
            results.forEach(function (result) {
                if (!result) {
                    visible = false;
                    course.show = false;
                } 
                    
            });

            const elem = document.getElementById(buildCourseRowId(course));

            if (elem) {
                if (course.show) {
                    elem.style.display = ""; 
                } else {
                    elem.style.display = "none";  
                }
            }
            
        });
}

function CounterSepCallback() {
    var i = 0;
    return function (resultSoFar, value) {
        // ignore value!
        i++;
        return (
            resultSoFar.length > 0
                ? ", "
                : ""
        ) + i;
    };
};

function BrSepCallback() {
    return function (resultSoFar, value) {
        return (
            resultSoFar.length > 0
                ? "<br/>"
                : ""
        ) + value;
    };
};

function includePeriodp(item) {
    return item;
};

function includeAlwaysp(item) {
    return true;
}

function makeSeparatedStringRecur(result, includep, sepCallback, arr) {
    if (arr.length == 0) {
        return result;
    } else {
        var value = arr[0];
        var str = sepCallback(result, value);
        return makeSeparatedStringRecur(result + (
            includep(value)
                ? str
                : ""
        ), includep, sepCallback, arr.splice(1, arr.length));
    }
};

function makeReloadCoursesPromise(code) {
    return new Promise(function (resolve, reject) {
        const holder = document.getElementById('courses');

        while (holder.childNodes.length > 2) {
            holder.removeChild(holder.lastChild);
        }

       // var div;
        var divNewRow;
        var courseTitle;
        var course;
        var i;
        var periods;
        var program;
        var year;
        var examiner;
        var responsible;


        for (i = 0; i < code.length; i++) {
            course = code[i];

            periods = makeSeparatedStringRecur(
                '',
                includePeriodp,
                CounterSepCallback(),
                [course.periodone, course.periodtwo, course.periodthree, course.periodfour]
            );

            program = makeSeparatedStringRecur(
                '',
                includeAlwaysp,
                BrSepCallback(),
                course.coursefacts.map(function (item) {
                    return item.name;
                })
            );

            year = makeSeparatedStringRecur(
                '',
                includeAlwaysp,
                BrSepCallback(),
                course.coursefacts.map(function (item) {
                    return item.year;
                })
            );

            examiner = course.examiner
                ? course.examiner.firstname
                : "";
            responsible = course.responsible
                ? course.responsible.firstname
                : "";


            function createRowDiv(idvalue, classvalue) {
                let newEl;
                newEl = document.createElement('div');
                newEl.id = idvalue;
                newEl.className = classvalue;
                newEl.innerHTML = '<div class="table-tesla__table__row">\
                            <div id="' + course.code + '" class="table-tesla' +
                        '__cell__text--bold">' + course.code + ' ' + course.name + '</div>\
                    ' +
                        '     <div class="table-tesla__cell__text">' + periods + '</div>\
                        ' +
                        '   <div class="table-tesla__cell__text">' + program + '</div>\
                        ' +
                        ' <div class="table-tesla__cell__text">' + year + '</div>\
                            <div' +
                        ' class="table-tesla__cell__text">' + examiner + '</div>\
                            <div ' +
                        'class="table-tesla__cell__text">' + responsible + '</div>\
                            </d' +
                        'iv>';
                console.log(newEl);

                return newEl;
            }

            divNewRow = createRowDiv(buildCourseRowId(course), "table-tesla__table__rowbox")




            // Append row element
            if (true) {
                holder.appendChild(divNewRow);
            }

            console.log(course.code);
            console.log(document.getElementById(course.code));

            courseTitle = document.getElementById(course.code);

            courseTitle.addEventListener('click', function () {
                console.log("hej");
            });
            
        }

        resolve();
    });
}

function buildCourseRowId(course) {
    return 'course-row-' + course.id;
}


function prepareForSuffixAndObjectFunction(baseUrl) {
    return(relUrl) => {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', baseUrl + '/' + relUrl);
            request.responseType = 'application/json';
            request.send();
            request.onload = () => resolve(JSON.parse(request.response).objects);
        })
    };
};

function compareId(reversed){
    return function(){
        reversed = !reversed;
        return function(a,b){
            if (reversed) {
                if (a.id === null) return 1;
                if (b.id === null) return -1;
                if (a.id < b.id)
                    return -1;
                if (a.id > b.id)
                    return 1;
                return 0;
            } else {
                if (a.id === null) return -1;
                if (b.id === null) return 1;
                if (a.id < b.id)
                    return 1;
                if (a.id > b.id)
                    return -1;
                return 0;
            }
        };
    };
};

var compareIdToggle = compareId(); // starts as false




function compareCode(reversed){
    return function(){
        reversed = !reversed;
        return function(a,b){
            if (reversed) {
                if (a.code === null) return 1;
                if (b.code === null) return -1;
                if (a.code < b.code)
                    return -1;
                if (a.code > b.code)
                    return 1;
                return 0;
            } else {
                if (a.code === null) return -1;
                if (b.code === null) return 1;
                if (a.code < b.code)
                    return 1;
                if (a.code > b.code)
                    return -1;
                return 0;
            }
        };
    };
};

var compareCodeToggle = compareCode(); // starts as false




function compareExaminer(reversed){
    return function(){
        reversed = !reversed;
        return function(a,b){
            if (reversed) {
                if (a.examiner === null) return 1;
                if (b.examiner === null) return -1;
                if (a.examiner.firstname < b.examiner.firstname)
                    return -1;
                if (a.examiner.firstname > b.examiner.firstname)
                    return 1;
                return 0;
            } else {
                if (a.examiner === null) return -1;
                if (b.examiner === null) return 1;
                if (a.examiner.firstname < b.examiner.firstname)
                    return 1;
                if (a.examiner.firstname > b.examiner.firstname)
                    return -1;
                return 0;
            }
        };
    };
};

var compareExaminerToggle = compareExaminer(); // starts as false


function compareResponsible(reversed){
    return function(){
        reversed = !reversed;
        return function(a,b){
            if (reversed) {
                if (a.responsible === null) return 1;
                if (b.responsible === null) return -1;
                if (a.responsible.firstname < b.responsible.firstname)
                    return -1;
                if (a.responsible.firstname > b.responsible.firstname)
                    return 1;
                return 0;
            } else {
                if (a.responsible === null) return -1;
                if (b.responsible === null) return 1;
                if (a.responsible.firstname < b.responsible.firstname)
                    return 1;
                if (a.responsible.firstname > b.responsible.firstname)
                    return -1;
                return 0;
            }
        };
    };
};

var compareResponsibleToggle = compareResponsible(); // starts as false





function createCheckboxesDivFn(type, typevalue, titleid, title, data, datavalue) {
    let newEl;
    newEl = document.createElement('div');
    newEl.setAttribute(type, typevalue);
    newEl.innerHTML = '<input\
        checked="checked"\
        class="w-checkbox-input"\
        data-' + data + '="' + datavalue + '"\
        name="checkbox-19"\
        type="checkbox">\
    <label class="field-label-6 w-form-label" for="checkbox-19">' + title + '</label>';
    return newEl;
}


function createFrameDivFn(type, typevalue, titleid, title, data, datavalue) {
    let newEl;
    newEl = document.createElement('div');
    newEl.setAttribute(type, typevalue);
    newEl.innerHTML = '<div class="form-wrapper-2 w-form">\
                        <form data-name="Email Form 2" id="email-form-2" name="email-form-2">\
                            <label class="field-label" for="name">' + title + '</label>\
                            <div id=' + titleid + ' class="table-tesla__checkbox__fieldbox">\
                            </div>\
                            </form>\
                            </div>';
    return newEl;
}


function childBuilderMaker(adderFn) {
    return function (model) {
        let child;
    
        child = adderFn(model.type, model.typevalue, model.titleid, model.title, model.data, model.datavalue);
        console.log(child);
    
        return child;
    };
};


function parentGetterMaker(typevalue) {
    return function () {
        return document.getElementById(typevalue);
    }
}


function sideBoxAdder(models, parentGetter, childBuilder) {
    let newBox;
    let boxParent = parentGetter();

    models.forEach(function(model) {
        boxParent.appendChild(childBuilder(model));
    });
};



function objfactory(param) {
    var code;
    var name;
    var id;
    var examiner;
    var examiner_firstname;
    var examiner_lastname;
    var examiner_id;
    var responsible;
    var responsible_firstname;
    var responsible_lastname;
    var responsible_id;
    var department;
    var periodone;
    var periodtwo;
    var periodthree;
    var periodfour;
    var coursefacts;

    code = param.code;
    id = param.id;
    name = param.name;

    if (param.examiner !== null) {
        examiner = param.examiner;
        examiner_firstname = examiner.firstname;
        examiner_lastname = examiner.lastname;
        examiner_id = examiner.id;
        department = examiner.department;
    } else {
        examiner_firstname = "";
        examiner_lastname = "";
        examiner_id = "";
    }

    if (param.responsible !== null) {
        responsible = param.responsible;
        responsible_firstname = responsible.firstname;
        responsible_lastname = responsible.lastname;
        responsible_id = responsible.id;
    } else {
        responsible_firstname = "";
        responsible_lastname = "";
        responsible_id = "";
    }
    
    
    periodone = param.periodone;
    periodtwo = param.periodtwo;
    periodthree = param.periodthree;
    periodfour = param.periodfour;
    coursefacts = param.coursefacts;

    return {
        "show": true,
        "name": name,
        "code": code,
        "id": id,
        "examiner": {
            "firstname": examiner_firstname,
            "lastname": examiner_lastname,
            "id": examiner_id
        },
        "responsible": {
            "firstname": responsible_firstname,
            "lastname": responsible_lastname,
            "id": responsible_id
        },
        "department": department,
        "periodone": periodone,
        "periodtwo": periodtwo,
        "periodthree": periodthree,
        "periodfour": periodfour,
        "coursefacts": coursefacts
    };
}



var RequestObjectAndDoStuff = prepareForSuffixAndObjectFunction(
    'http://127.0.0.1:5000'
);
var databases = {};
var events = {};

events.sendOnReloadCourses = () => {
    var divCourses = document.getElementById('courses');
    divCourses.dispatchEvent(new Event('onReloadCourses'));
}
//var sideBox = sideBoxFactory('sideboxes');
//
document.addEventListener("DOMContentLoaded", function () {


    let p3 = new Promise((resolve, reject) => {

        var boxesArray = [];

        boxesArray = [{"title": "PERIOD", "titleid": "periodcheckboxes",}, {"title": "PROGRAM", "titleid": "programcheckboxes",}, {"title": "DEPARTMENT", "titleid": "departmentcheckboxes",}, {"title": "YEAR", "titleid": "yearcheckboxes",}];

        var frameObjs = [];

        boxesArray.forEach(function(box) {
            let frameObj = {
                "type": "class",
                "typevalue": "table-tesla__checkboxblock",
                "title": box.title,
                "titleid": box.titleid
            }
            frameObjs.push(frameObj);
        })
   
        sideBoxAdder(frameObjs, parentGetterMaker('sideboxes'), childBuilderMaker(createFrameDivFn));

        




    
    
        var periodsArray = [];
    
        periodsArray = [[1, "periodone"], [2, "periodtwo"], [3, "periodthree"], [4, "periodfour"]];
    
        var periodCheckboxObjs = [];
    
        periodsArray.forEach(function(period) {
            let periodCheckboxObj;
    
            periodCheckboxObj = {
                "type": "class",
                "typevalue": "w-checkbox w-clearfix",
                "title": period[0],
                "data": "period",
                "datavalue": period[1]
            }
            periodCheckboxObjs.push(periodCheckboxObj);
        })
    
        sideBoxAdder(periodCheckboxObjs, parentGetterMaker('periodcheckboxes'), childBuilderMaker(createCheckboxesDivFn));


    
        var programsArray = [];
    
        programsArray = ["CSAMH", "TFOFK", "TFAFK", "Other", "None"];
    
        var programCheckboxObjs = [];
    
        programsArray.forEach(function(program) {
            let programCheckboxObj;
    
            programCheckboxObj = {
                "type": "class",
                "typevalue": "w-checkbox w-clearfix",
                "title": program,
                "data": "program",
                "datavalue": program
            }
            programCheckboxObjs.push(programCheckboxObj);
        })
    
        sideBoxAdder(programCheckboxObjs, parentGetterMaker('programcheckboxes'), childBuilderMaker(createCheckboxesDivFn));


    
        var departmentsArray = [];
    
        departmentsArray = ["AIB", "AIC", "AID", "AIE"];
    
        var departmentCheckboxObjs = [];
    
        departmentsArray.forEach(function(department) {
            let departmentCheckboxObj;
    
            departmentCheckboxObj = {
                "type": "class",
                "typevalue": "w-checkbox w-clearfix",
                "title": department,
                "data": "department",
                "datavalue": department
            }
            departmentCheckboxObjs.push(departmentCheckboxObj);
        })
    
        sideBoxAdder(departmentCheckboxObjs, parentGetterMaker('departmentcheckboxes'), childBuilderMaker(createCheckboxesDivFn));



    
        var yearsArray = [];
    
        yearsArray = ["1", "2", "3"];
    
        var yearCheckboxObjs = [];
    
        yearsArray.forEach(function(year) {
            let yearCheckboxObj;
    
            yearCheckboxObj = {
                "type": "class",
                "typevalue": "w-checkbox w-clearfix",
                "title": year,
                "data": "department",
                "datavalue": year
            }
            yearCheckboxObjs.push(yearCheckboxObj);
        }) 
    
        sideBoxAdder(yearCheckboxObjs, parentGetterMaker('yearcheckboxes'), childBuilderMaker(createCheckboxesDivFn));


        resolve();
        

      });
    
// TEST CODE
    
    // let p1 = new Promise((resolve, reject) => {

    //     setTimeout(function(){
    //       resolve("Success p1"); // Yay! Everything went well!
    //     }, 1000);
    //   });
    
    // let p2 = new Promise((resolve, reject) => {
    //     setTimeout(function(){
    //         resolve("Success p2"); // Yay! Everything went well!
    //       }, 10000);
    // });

    Promise.all([p3]).then(function (res) {
        //console.log(res[0] + " " + res[1]);
        setupEventListeners();
        RequestObjectAndDoStuff('api/courses').then((objs) => {
            
                    var newobjs = [];
            
                    objs.forEach(function (param) {
                        var testobj = objfactory(param);
                        newobjs.push(testobj);
                        console.log(testobj.code + ' ' + testobj.id);
                    });
                    
                    databases.courses = newobjs;
                    events.sendOnReloadCourses();
                });
    });


    setInterval(function(){ 
        RequestObjectAndDoStuff('api/courses').then((objs) => {
            
                    var newobjs = [];
            
                    objs.forEach(function (param) {
                        var testobj = objfactory(param);
                        console.log(testobj.examiner.firstname);
                        newobjs.push(testobj);
                        //console.log(testobj.code + ' ' + testobj.id);
                    });
                    
                    databases.courses = newobjs;
                    //events.sendOnReloadCourses();
                });
    }, 10000);

});


/* When document ready, set click handlers for the filter boxes */
function setupEventListeners() {
    var divCourses = document.getElementById('courses');
    divCourses.addEventListener('onReloadCourses', function () {
        databases.courses.sort(compareCodeToggle());
        let p = makeReloadCoursesPromise(databases.courses);
        p.then(coursesFilter);
    });

    var divSortCourses = document.getElementById('sort_courses');
    divSortCourses.addEventListener('click', function () {
        databases.courses.sort(compareCodeToggle());
        let p = makeReloadCoursesPromise(databases.courses);
        p.then(coursesFilter);
    });


    var divSortExaminer = document.getElementById('sort_examiner');
    divSortExaminer.addEventListener('click', function () {
        databases.courses.sort(compareExaminerToggle());
        let p = makeReloadCoursesPromise(databases.courses);
        p.then(coursesFilter);
    });

    var divSortResponsible = document.getElementById('sort_responsible');
    divSortResponsible.addEventListener('click', function () {
        databases.courses.sort(compareResponsibleToggle());
        let p = makeReloadCoursesPromise(databases.courses);
        p.then(coursesFilter);
    });

    var periodfilters = document
        .getElementById('periodcheckboxes')
        .childNodes;
    for (var i = 0; i < periodfilters.length; i++) {
        periodfilters[i].addEventListener('click', coursesFilter);
    }

    var programfilters = document
        .getElementById('programcheckboxes')
        .childNodes;
    for (var i = 0; i < programfilters.length; i++) {
        programfilters[i].addEventListener('click', coursesFilter);
    }

    var yearfilters = document
        .getElementById('yearcheckboxes')
        .childNodes;
    for (var i = 0; i < yearfilters.length; i++) {
        yearfilters[i].addEventListener('click', coursesFilter);
    }

    var departmentfilters = document
        .getElementById('departmentcheckboxes')
        .childNodes;
    for (var i = 0; i < departmentfilters.length; i++) {
        departmentfilters[i].addEventListener('click', coursesFilter);
    }
}
