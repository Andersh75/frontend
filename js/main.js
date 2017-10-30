'use strict';  

function coursesFilter() {
    this.click();

    const predicateArrays = [];
    predicateArrays[0] = [];
    predicateArrays[1] = [];
    predicateArrays[2] = [];
    predicateArrays[3] = [];

    var elems;

    // Periods
    elems = document.getElementById('periodcheckboxes').children;
    Array.from(elems).forEach(function (elem) {
        const checkbox = elem.children[0];
        console.log(checkbox);
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
            console.log(results);
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


function removeAllSlotsFromHolder(remain, holder) {
    while (holder.childNodes.length > remain) {
        holder.removeChild(holder.lastChild);
    }
}


function createRowDiv(idvalue, classvalue, course, periods, program, year, responsible, examiner) {
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



function createClassRowDiv(item) {
    let newEl;
    let firstEl;
    newEl = document.createElement('div');
    newEl.setAttribute("class", "table-tesla__table__rowbox"); // <div class="table-tesla__table__headerbox">
    
    firstEl = document.createElement('div');
    //firstEl.setAttribute("id", param.id);
    firstEl.setAttribute("class", "table-tesla__table__row");

    newEl.appendChild(firstEl);
    item.forEach(function(param) {
        
        let innerEl;
        
        innerEl = document.createElement('div');
        innerEl.setAttribute("class", param.class);
        innerEl.innerHTML = param.lable;
        firstEl.appendChild(innerEl);
        
    });

    return newEl;
}


function classBuilder(classArray) {
    const holder = document.getElementById('courses');
    let divNewRow = createClassRowDiv(classArray);
    if (true) {
       holder.appendChild(divNewRow);
   }

}


function makeReloadCoursesPromise(code) {
    return new Promise(function (resolve, reject) {

        var divNewRow;
        var courseTitle;
        var course;
        var i;
        var periods;
        var program;
        var year;
        var examiner;
        var responsible;


        removeAllSlotsFromHolder(2, divs.divCourses);

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


            divNewRow = createRowDiv(buildCourseRowId(course), "table-tesla__table__rowbox", course, periods, program, year, responsible, examiner);

            divs.divCourses.appendChild(divNewRow);



            divs['div' + course.code] = document.getElementById(course.code);

            divs['div' + course.code].click = function () {
                this.publish(this.id, "click");
            }
        
            makePublisher(divs['div' + course.code]);
        
            divs['div' + course.code].subscribe(divs.divPagetitle.setTitle, 'click');


            divs['div' + course.code].addEventListener('click', function () {
                this.click();

                let that = this;

                RequestObjectAndDoStuff('api/classes?q={"filters":[{"name":"courses","op":"has","val":{"name":"code","op":"eq","val":"' + that.id + '"}}]}').then((objs) => {
                    buildClasses(objs);
                });
                
            });
            
        };

        resolve();
    });
}

function buildCourseRowId(course) {
    return 'course-row-' + course.id;
}


function buildClasses(objs) {
    return new Promise(function (resolve, reject) {

        divs.divSideboxes.setAttribute("class", "schedule-tesla__right");
        divs.divCourses.setAttribute("class", "schedule-tesla__left");
        divs.divSideboxesRight.setAttribute("class", "schedule-tesla__right");

        databases.classes = objs;

  



        // var boxesAr = [];
        
        //         boxesAr = [
        //             {
        //                 kind: 'examiner',
        //                 values: [[myCourseobj.examiner.firstname + " " + myCourseobj.examiner.lastname, myCourseobj.examiner.id]],
        //                 title: "EXAMINER",
        //                 titleid: "examinercheckboxes2"
        //             },
        //             {
        //                 kind: 'responsible',
        //                 values: [[myCourseobj.responsible.firstname + " " + myCourseobj.responsible.lastname, myCourseobj.responsible.id]],
        //                 title: "RESPONSIBLE",
        //                 titleid: "responsiblecheckboxes2"
        //             }
        //         ];
        
        
        //         sideBuilder(boxesAr, 'sideboxesRight');




        // BUILD MAIN


        removeAllSlotsFromHolder(1, divs.divCourses);


        var mainAr = [];
        
        mainAr = [
            {
                lable: "DATE",
                id: "sort_courses",
                class: "table-tesla__header__lablebox-period", 
            },
            {
                lable: "TIME",
                id: "sort_times",
                class: "table-tesla__header__lablebox-period" 
            },
            {
                lable: "TYPE",
                id: "sort_types",
                class: "table-tesla__header__lablebox-period" 
            },
            {
                lable: "TITLE",
                id: "sort_titles",
                class: "table-tesla__header__lablebox--course" 
            },
            {
                lable: "ROOM",
                id: "sort_rooms",
                class: "table-tesla__table__header__lablebox-programandyear"
            },
            {
                lable: "TEACHERS",
                id: "sort_teachers",
                class: "table-tesla__table__header__lablebox-programandyear" 
            }
        ]

        mainBuilder(mainAr);


        var myBigRoomAr = new Set();
        

        databases.classes.forEach(function(item) {
            let myClass = [];

            let myroomar = item.rooms.reduce(function(myrooms, roomar) {
                myrooms.push(roomar.name);
                return myrooms;
             }, []);

             let myset = new Set();

             myroomar.forEach(function(item) {
                myset.add(item);
             })

             myBigRoomAr = myBigRoomAr.union(myset);

             //console.log(myBigRoomAr);



             //myBigRoomAr = myBigRoomAr.union(myroomar);

             //console.log(myBigRoomAr);

            let myroom = item.rooms.reduce(function(mystring, roomar) {
                if (mystring === "") {
                    return mystring + roomar.name;
                } else
                return mystring + ", " + roomar.name;
             }, "");


             let myteachers = item.teachers.reduce(function(mystring, teacherar) {
                if (mystring === "") {
                    return mystring + teacherar.firstname.slice(0, 1) + teacherar.lastname.slice(0, 1);
                } else
                return mystring + ", " + teacherar.firstname.slice(0, 1) + teacherar.lastname.slice(0, 1);
             }, "");

            // console.log(myroom);

            myClass = [
                {
                    class: "table-tesla__cell__text",
                    lable: item.dates.date.slice(2, 10)
                },
                {
                    class: "table-tesla__cell__text",
                    lable: item.starttime + '-' + item.endtime
                },
                {
                    class: "table-tesla__cell__text",
                    lable: item.classtypes.classtype.slice(0, 1)
                },
                {
                    class: "table-tesla__cell__text--bold",
                    lable: item.content
                },
                {
                    class: "table-tesla__cell__text",
                    lable: myroom
                },
                {
                    class: "table-tesla__cell__text",
                    lable: myteachers
                }
            ];

        
            classBuilder(myClass);

            
        })

        let ArConvertedFromSet = Array.from(myBigRoomAr);
        
        ArConvertedFromSet.sort(function (a, b) {
            var nameA=a.toLowerCase(), nameB=b.toLowerCase();
            if (nameA < nameB) //sort string ascending
             return -1;
            if (nameA > nameB)
             return 1;
            return 0;
        });

        console.log(ArConvertedFromSet);


        let nextAr = ArConvertedFromSet.map(function(item) {
            let newAr = [];
            newAr.push(item);
            newAr.push(item);
            return newAr;
        })

        // myBigRoomAr.union(myset);

        // console.log(myBigRoomAr);

              // Build left side

        removeAllSlotsFromHolder(0, divs.divSideboxes);
        
        let myCourseobj = databases.courses.filter(function( obj ) {
                return obj.code == databases.classes[0].courses.code;
                })[0];

        var boxesAr = [];

        boxesAr = [
            {
                kind: 'examiner',
                values: [[myCourseobj.examiner.firstname + " " + myCourseobj.examiner.lastname, myCourseobj.examiner.id]],
                title: "EXAMINER",
                titleid: "examinercheckboxes"
            },
            {
                kind: 'responsible',
                values: [[myCourseobj.responsible.firstname + " " + myCourseobj.responsible.lastname, myCourseobj.responsible.id]],
                title: "RESPONSIBLE",
                titleid: "responsiblecheckboxes"
            },
            {
                kind: 'teachers',
                values: nextAr,
                title: "TEACHERS",
                titleid: "teacherscheckboxes"
            }
        ];


        sideBuilder(boxesAr, 'sideboxes');

        resolve();

    });
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



function compareLevelOne(reversed){
    return function(item1){
        reversed = !reversed;
        return function(a,b){
            if (reversed) {
                if (a[item1] === null) return 1;
                if (b[item1] === null) return -1;
                if (a[item1] < b[item1])
                    return -1;
                if (a[item1] > b[item1])
                    return 1;
                return 0;
            } else {
                if (a[item1] === null) return -1;
                if (b[item1] === null) return 1;
                if (a[item1] < b[item1])
                    return 1;
                if (a[item1] > b[item1])
                    return -1;
                return 0;
            }
        };
    };
};

function compareLevelTwo(reversed){
    return function(item1, item2){
        reversed = !reversed;
        return function(a,b){
            if (reversed) {
                if (a[item1] === null) return 1;
                if (b[item1] === null) return -1;
                if (a[item1][item2] < b[item1][item2])
                    return -1;
                if (a[item1][item2] > b[item1][item2])
                    return 1;
                return 0;
            } else {
                if (a[item1] === null) return -1;
                if (b[item1] === null) return 1;
                if (a[item1][item2] < b[item1][item2])
                    return 1;
                if (a[item1][item2] > b[item1][item2])
                    return -1;
                return 0;
            }
        };
    };
};

var compareCoursesToggle = compareLevelOne(); // starts as false
var compareExaminerToggle = compareLevelTwo(); // starts as false
var compareResponsibleToggle = compareLevelTwo(); // starts as false



function createCheckboxesDivFn(item) {
    let newEl;
    newEl = document.createElement('div');
    newEl.setAttribute(item.type, item.typevalue);
    newEl.innerHTML = '<input\
        checked="checked"\
        class="w-checkbox-input"\
        data-' + item.data + '="' + item.datavalue + '"\
        name="checkbox-19"\
        type="checkbox">\
    <label class="field-label-6 w-form-label" for="checkbox-19">' + item.title + '</label>';
    return newEl;
}


function createFrameDivFn(item) {
    let newEl;
    newEl = document.createElement('div');
    newEl.setAttribute(item.type, item.typevalue);
    newEl.innerHTML = '<div class="form-wrapper-2 w-form">\
                        <form data-name="Email Form 2" id="email-form-2" name="email-form-2">\
                            <label class="field-label" for="name">' + item.title + '</label>\
                            <div id=' + item.titleid + ' class="table-tesla__checkbox__fieldbox">\
                            </div>\
                            </form>\
                            </div>';
    return newEl;
}


function createMainCoursesDivFn(item) {
    let newEl;
    newEl = document.createElement('div');
    newEl.setAttribute(item.type, item.typevalue); // <div class="table-tesla__table__headerbox">
    item.lables.forEach(function(param) {
        let firstEl;
        let innerEl;
        firstEl = document.createElement('div');
        firstEl.setAttribute("id", param.id);
        firstEl.setAttribute("class", param.class);
        innerEl = document.createElement('div');
        innerEl.setAttribute("class", 'table-tesla__header__cell__text');
        innerEl.innerHTML = param.lable;
        firstEl.appendChild(innerEl);
        newEl.appendChild(firstEl);
    });

    return newEl;
}


function createMainClassesDivFn(item) {
    let newEl;
    newEl = document.createElement('div');
    newEl.setAttribute(item.type, item.typevalue); // <div class="table-tesla__table__headerbox">
    item.lables.forEach(function(param) {
        let firstEl;
        let innerEl;
        firstEl = document.createElement('div');
        firstEl.setAttribute("id", param.id);
        firstEl.setAttribute("class", param.class);
        innerEl = document.createElement('div');
        innerEl.setAttribute("class", 'table-tesla__header__cell__text');
        innerEl.innerHTML = param.lable;
        firstEl.appendChild(innerEl);
        newEl.appendChild(firstEl);
    });

    return newEl;
}





function childBuilderMaker(adderFn) {
    return function (model) {
        let child;
    
        child = adderFn(model);
    
        return child;
    };
};



function parentGetterMaker(typevalue) {
    return function () {
        return document.getElementById(typevalue);
    }
}


function boxAdder(models, parentGetter, childBuilder) {
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


var publisher = {
    subscribers: {
        any: []
    },
    subscribe: function (fn, type) {
        type = type || 'any';
        if (typeof this.subscribers[type] === "undefined") {
            this.subscribers[type] = [];
        }
        this.subscribers[type].push(fn);
    },
    unsubscribe: function (fn, type) {
        this.visitSubscribers('unsubscribe', fn, type);
    },
    publish: function (publication, type) {
        this.visitSubscribers('publish', publication, type);
    },
    visitSubscribers: function (action, arg, type) {
        var pubtype = type || 'any',
            subscribers = this.subscribers[pubtype],
            i,
            max = subscribers.length;

        for (i = 0; i < max; i += 1) {
            if (action === 'publish') {
                subscribers[i](arg);
            } else {
                if (subscribers[i] === arg) {
                    subscribers.splice(i, 1);
                }
            }
        }
    }
};


function makePublisher(o) {
    var i;
    for (i in publisher) {
        if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
            o[i] = publisher[i];
        }
    }
    o.subscribers = {any: []};
}


function buildCourses() {
    let buildSiteFrame = new Promise((resolve, reject) => {
        removeAllSlotsFromHolder(1, divs.divCourses);
        removeAllSlotsFromHolder(0, divs.divSideboxes);
        removeAllSlotsFromHolder(0, divs.divSideboxesRight);
        
        divs.divCourses.removeAttribute("class");
        divs.divSideboxes.removeAttribute("class");
        divs.divSideboxesRight.removeAttribute("class");

        divs.divSideboxes.setAttribute("class", "table-tesla__left");
        divs.divCourses.setAttribute("class", "table-tesla__right");
        
        // Build left side


        var boxesAr = [];

        boxesAr = [
            {
                kind: 'year',
                values: [["1", "1"], ["2", "2"], ["3", "3"]],
                title: "YEAR",
                titleid: "yearcheckboxes"
            },
            {
                kind: 'department',
                values: [["AIB", "AIB"], ["AIC", "AIC"], ["AID", "AID"], ["AIE", "AIE"]],
                title: "DEPARTMENT",
                titleid: "departmentcheckboxes"
            },
            {
                kind: 'program',
                values: [["CSAMH", "CSAMH"], ["TFOFK", "TFOFK"], ["TFAFK", "TFAFK"], ["Other", "Other"], ["None", "None"]],
                title: "PROGRAM",
                titleid: "programcheckboxes"
            },
            {
                kind: 'period',
                values: [[1, "periodone"], [2, "periodtwo"], [3, "periodthree"], [4, "periodfour"]],
                title: "PERIOD",
                titleid: "periodcheckboxes"
            },
            {
                kind: 'schools',
                values: [["KTH", "KTH"], ["SU", "SU"]],
                title: "SCHOOLS",
                titleid: "schoolscheckboxes"
            }
        ];


        sideBuilder(boxesAr, 'sideboxes');






        // BUILD MAIN



        var mainAr = [];

        mainAr = [
            {
                lable: "COURSE3",
                prop: "divSort_courses", 
                id: "sort_courses",
                class: "table-tesla__header__lablebox--course", 
                compareFn: compareCoursesToggle,
                sort1: 'code',
                sort2: ''
            },
            {
                lable: "PERIOD",
                id: "sort_periods",
                class: "table-tesla__header__lablebox-period" 
            },
            {
                lable: "PROGRAM",
                id: "sort_program",
                class: "table-tesla__table__header__lablebox-programandyear" 
            },
            {
                lable: "YEAR",
                id: "sort_year",
                class: "table-tesla__table__header__lablebox-programandyear" 
            },
            {
                lable: "EXAMINER",
                prop: "divSort_examiner", 
                id: "sort_examiner",
                class: "table-tesla__table__header__lablebox-programandyear", 
                compareFn: compareExaminerToggle,
                sort1: 'examiner',
                sort2: 'firstname'
            },
            {
                lable: "RESPONSIBLE",
                prop: "divSort_responsible", 
                id: "sort_responsible",
                class: "table-tesla__table__header__lablebox-programandyear", 
                compareFn: compareResponsibleToggle,
                sort1: 'responsible',
                sort2: 'firstname'
            }
        ]

        mainBuilder(mainAr);


        resolve();
        

        });
    

    Promise.all([buildSiteFrame]).then(function (res) {
        setupEventListeners();
        if (databases.courses.length > 0) {
            events.sendOnReloadCourses();
        } else {
            RequestObjectAndDoStuff('api/courses').then((objs) => {
                
                        var newobjs = [];
                
                        objs.forEach(function (param) {
                            var testobj = objfactory(param);
                            newobjs.push(testobj);
                        });
                        
                        databases.courses = newobjs;
                        events.sendOnReloadCourses();
                        
                        
                    });
        }
        
        
    });

}



var RequestObjectAndDoStuff = prepareForSuffixAndObjectFunction(
    'http://127.0.0.1:5000'
);

var databases = {};

databases.courses = [];
var events = {};
var divs = {};

events.sendOnReloadCourses = () => {
    var divCourses = document.getElementById('courses');
    divCourses.dispatchEvent(new Event('onReloadCourses'));
}

function sortCoursesAndFilter (sortfn, sort1, sort2) {
    this.click();
    databases.courses.sort(sortfn(sort1, sort2));
    let p = makeReloadCoursesPromise(databases.courses);
    p.then(coursesFilter);
};



function sideBuilder(boxesArray, side) {
    var frameObjs = [];
    
    boxesArray.forEach(function(box) {
        let frameObj = {
            "type": "class",
            "typevalue": "table-tesla__checkboxblock",
            "title": box.title,
            "titleid": box.titleid
        }
        console.log(frameObj);
        frameObjs.push(frameObj);
    })

    boxAdder(frameObjs, parentGetterMaker(side), childBuilderMaker(createFrameDivFn));


    divs.divPeriodcheckboxes = document.getElementById('periodcheckboxes');
    divs.divProgramcheckboxes = document.getElementById('programcheckboxes');
    divs.divDepartmentcheckboxes = document.getElementById('departmentcheckboxes');
    divs.divYearcheckboxes = document.getElementById('yearcheckboxes');



    boxesArray.forEach(function(item) {

        var CheckboxObjs = [];
        
        item.values.forEach(function(param) {
            let CheckboxObj;
    
            CheckboxObj = {
                "type": "class",
                "typevalue": "w-checkbox w-clearfix",
                "title": param[0],
                "data": item.kind,
                "datavalue": param[1]
            }
            CheckboxObjs.push(CheckboxObj);
        }) 
    
        boxAdder(CheckboxObjs, parentGetterMaker(item.kind + 'checkboxes'), childBuilderMaker(createCheckboxesDivFn));

        var filters = document.getElementById(item.kind + 'checkboxes').childNodes;
        
        for (var i = 0; i < filters.length; i++) {
            divs[item.kind + 'filter' + i] = filters[i];
            makePublisher(divs[item.kind + 'filter' + i]);
            divs[item.kind + 'filter' + i].click = function () {
                this.publish(this.children[1].textContent, "click");
            }
        
            divs[item.kind + 'filter' + i].subscribe(divs.divPagetitle.setTitle, 'click');
            divs[item.kind + 'filter' + i].addEventListener('click', coursesFilter.bind(divs[item.kind + 'filter' + i]));
        }
    });
}



function mainBuilder(mainArray) {
    var frameObjs = [
        {
        "type": "class",
        "typevalue": "table-tesla__table__headerbox",
        "lables": mainArray
        }
    ];


    boxAdder(frameObjs, parentGetterMaker('courses'), childBuilderMaker(createMainCoursesDivFn));

    
    mainArray.forEach(function(item) {
        divs[item.prop] = document.getElementById(item.id);

        makePublisher(divs[item.prop]);
        
        divs[item.prop].click = function () {
            this.publish(this.children[0].textContent, "click");
        }
    
        divs[item.prop].subscribe(divs.divPagetitle.setTitle, 'click');

        divs[item.prop].addEventListener('click', sortCoursesAndFilter.bind(divs[item.prop], item.compareFn, item.sort1, item.sort2));

    });
}


Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
}

Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}



document.addEventListener("DOMContentLoaded", function () {

    divs.divCourses = document.getElementById('courses');
    divs.divMenuCourses = document.getElementById('menu-courses');
    divs.divSideboxes = document.getElementById('sideboxes');
    divs.divSideboxesRight = document.getElementById('sideboxesRight');
    divs.divPagetitle = document.getElementById('pagetitle');

    divs.divPagetitle.setTitle = function (title) {
            divs.divPagetitle.textContent = title;
        };

    buildCourses()

    
    
    



    // Get new data regularly and update objects

    setInterval(function(){ 
        RequestObjectAndDoStuff('api/courses').then((objs) => {
            
                    var newobjs = [];
            
                    objs.forEach(function (param) {
                        var testobj = objfactory(param);
                        newobjs.push(testobj);
                    });
                    
                    databases.courses = newobjs;
                });
    }, 10000);

        // Get new data regularly and update objects

    setInterval(function(){ 
        RequestObjectAndDoStuff('api/rooms').then((objs) => {
            
                    // var newobjs = [];
            
                    // objs.forEach(function (param) {
                    //     var testobj = objfactory(param);
                    //     newobjs.push(testobj);
                    // });
                    
                    databases.rooms = objs;
                });
    }, 10000);

});





/* When document ready, set click handlers for the filter boxes */
function setupEventListeners() {
    var divCourses = divs.divCourses;
    divCourses.addEventListener('onReloadCourses', function () {
        databases.courses.sort(compareCoursesToggle());
        let p = makeReloadCoursesPromise(databases.courses);
        p.then(coursesFilter);
    });


    var divMenuCourses = divs.divMenuCourses;
    makePublisher(divs.divMenuCourses);
    
    divs.divMenuCourses.click = function () {
        this.publish("HELLO!", "click");
    }

    divs.divMenuCourses.subscribe(divs.divPagetitle.setTitle, 'click');
    divs.divMenuCourses.addEventListener('click', function() {
        this.click();
        buildCourses();
    });
}
