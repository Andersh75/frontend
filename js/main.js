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

        console.log(holder.childNodes.length);

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

            divs['div' + course.code] = courseTitle;

            divs['div' + course.code].click = function () {
                this.publish(this.id, "click");
            }
        
            makePublisher(divs['div' + course.code]);
        
            divs['div' + course.code].subscribe(divs.divPagetitle.setTitle, 'click');


            divs['div' + course.code].addEventListener('click', function () {
                console.log("THIS");
                console.log(this);
                this.click();
                //console.log(this.id);
                console.log('api/classes?q={"filters":[{"name":"courses","op":"has","val":{"name":"code","op":"eq","val":""}}]}');

                let that = this;

                RequestObjectAndDoStuff('api/classes?q={"filters":[{"name":"courses","op":"has","val":{"name":"code","op":"eq","val":"' + that.id + '"}}]}').then((objs) => {
                    return new Promise(function (resolve, reject) {
                        console.log("OBJS:");
                        console.log(objs);
                        databases.classes = objs
                    
                        const holder = document.getElementById('sideboxes');
                        while (holder.childNodes.length > 0) {
                            holder.removeChild(holder.lastChild);
                        }
                    
        
                        var boxesArray = [];
                        
                        boxesArray = [{"title": "COURSE", "titleid": "coursecheckboxes",}, {"title": "EXAMINER", "titleid": "examinercheckboxes",}, {"title": "RESPONSIBLE", "titleid": "responsiblecheckboxes",}, {"title": "TEACHER", "titleid": "teachercheckboxes",}];
                
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
                    
                        boxAdder(frameObjs, parentGetterMaker('sideboxes'), childBuilderMaker(createFrameDivFn));
                        let myCourseobj = databases.courses.filter(function( obj ) {
                            return obj.code == that.id;
                          })[0];

                        resolve(myCourseobj);
                        }).then(function(myCourseobj) {
                            console.log("XXX")


                            var examinersArray = [];
                            
                            examinersArray = [myCourseobj.examiner];
                        
                            var examinerCheckboxObjs = [];
                        
                            examinersArray.forEach(function(examiner) {
                                let examinerCheckboxObj;
                        
                                examinerCheckboxObj = {
                                    "type": "class",
                                    "typevalue": "w-checkbox w-clearfix",
                                    "title": examiner.firstname + " " + examiner.lastname,
                                    "data": "examiner",
                                    "datavalue": examiner.id
                                }
                                examinerCheckboxObjs.push(examinerCheckboxObj);
                            })
                        
                            boxAdder(examinerCheckboxObjs, parentGetterMaker('examinercheckboxes'), childBuilderMaker(createCheckboxesDivFn));



                            var responsiblesArray = [];
                            
                            responsiblesArray = [myCourseobj.responsible];
                        
                            var responsibleCheckboxObjs = [];
                        
                            responsiblesArray.forEach(function(responsible) {
                                let responsibleCheckboxObj;
                        
                                responsibleCheckboxObj = {
                                    "type": "class",
                                    "typevalue": "w-checkbox w-clearfix",
                                    "title": responsible.firstname + " " + responsible.lastname,
                                    "data": "responsible",
                                    "datavalue": responsible.id
                                }
                                responsibleCheckboxObjs.push(responsibleCheckboxObj);
                            })
                        
                            boxAdder(responsibleCheckboxObjs, parentGetterMaker('responsiblecheckboxes'), childBuilderMaker(createCheckboxesDivFn));







                            // BUILD MAIN

                            const holder = document.getElementById('courses');
                            
                            console.log(holder.childNodes.length);
                    
                            while (holder.childNodes.length > 1) {
                                holder.removeChild(holder.lastChild);
                            }


                            var boxesArray = [];
                            
                            boxesArray = [{"title": "PERIOD", "titleid": "periodcheckboxes"}];

                            var frameObjs = [];

                            boxesArray.forEach(function(box) {
                                let frameObj = {
                                    "type": "class",
                                    "typevalue": "table-tesla__table__headerbox",
                                    "title": box.title,
                                    "titleid": box.titleid
                                }
                                frameObjs.push(frameObj);
                            })
                        
                            boxAdder(frameObjs, parentGetterMaker('courses'), childBuilderMaker(createMainClassesDivFn));



                        


                            databases.classes.forEach(function(item) {
                                console.log(item.content);
                                function createRowDiv(idvalue, classvalue) {
                                    let newEl;
                                    newEl = document.createElement('div');
                                    newEl.id = idvalue;
                                    newEl.className = classvalue;
                                    newEl.innerHTML = '<div class="table-tesla__table__row">\
                                                <div id="class-' + item.id + '" class="table-tesla' +
                                            '__cell__text--bold">' + item.dates.date + '</div>\
                                        ' +
                                            '     <div class="table-tesla__cell__text">' + item.starttime + '-' + item.endtime + '</div>\
                                            ' +
                                            '   <div class="table-tesla__cell__text">' + item.classtypes.classtype + '</div>\
                                            ' +
                                            ' <div class="table-tesla__cell__text">' + item.content + '</div>\
                                                <div' +
                                            ' class="table-tesla__cell__text">' + item.id + '</div>\
                                                <div ' +
                                            'class="table-tesla__cell__text">' + item.id + '</div>\
                                                </d' +
                                            'iv>';
                                    console.log(newEl);
                    
                                    return newEl;
                                }
                                 divNewRow = createRowDiv(buildCourseRowId(item), "table-tesla__table__rowbox");
                                 if (true) {
                                    holder.appendChild(divNewRow);
                                }
                             })

                                
                    
                                

                            



                            // MAIN BUILT


    
                            // var pagetitle = document.getElementById("pagetitle");
                            
                            // pagetitle.textContent = databases.courses.filter(function( obj ) {
                            //     return obj.code == that.id;
                            //     })[0].code;
                        });;

                        

                    })
            });
            
        };

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




function compareCourses(reversed){
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

var compareCoursesToggle = compareCourses(); // starts as false




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
    newEl.innerHTML = '<div id="sort_courses" class="table-tesla__header__lablebox--course">\
    <div class="table-tesla__header__cell__text">' + item.lables[0] + '</div>\
</div>\
<div class="table-tesla__header__lablebox-period">\
    <div class="table-tesla__header__cell__text">PERIOD</div>\
</div>\
<div class="table-tesla__table__header__lablebox-programandyear">\
    <div class="table-tesla__header__cell__text">PROGRAM</div>\
</div>\
<div class="table-tesla__table__header__lablebox-programandyear">\
    <div class="table-tesla__header__cell__text">YEAR</div>\
</div>\
<div id="sort_examiner" class="table-tesla__table__header__lablebox-programandyear">\
    <div class="table-tesla__header__cell__text">EXAMINER</div>\
</div>\
<div id="sort_responsible" class="table-tesla__table__header__lablebox-programandyear">\
    <div class="table-tesla__header__cell__text">RESPONSIBLE</div>\
</div>';

    return newEl;
}


function createMainClassesDivFn(item) {
    let newEl;
    newEl = document.createElement('div');
    newEl.setAttribute(item.type, item.typevalue);
    newEl.innerHTML = '<div id="sort_courses" class="table-tesla__header__lablebox--course">\
    <div class="table-tesla__header__cell__text">DATE</div>\
</div>\
<div class="table-tesla__header__lablebox-period">\
    <div class="table-tesla__header__cell__text">TIME</div>\
</div>\
<div class="table-tesla__table__header__lablebox-programandyear">\
    <div class="table-tesla__header__cell__text">TYPE</div>\
</div>\
<div class="table-tesla__table__header__lablebox-programandyear">\
    <div class="table-tesla__header__cell__text">TITLE</div>\
</div>\
<div id="sort_examiner" class="table-tesla__table__header__lablebox-programandyear">\
    <div class="table-tesla__header__cell__text">ROOM</div>\
</div>\
<div id="sort_responsible" class="table-tesla__table__header__lablebox-programandyear">\
    <div class="table-tesla__header__cell__text">TEACHERS</div>\
</div>';
    return newEl;
}





function childBuilderMaker(adderFn) {
    return function (model) {
        let child;
    
        child = adderFn(model);
        console.log(child);
    
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


var paper = {
    daily: function () {
        this.publish("big news today");
    },
    monthly: function () {
        this.publish("interesting analysis", "monthly");
    }
};

makePublisher(paper);

var joe = {
    drinkCoffee: function (paper) {
        console.log('Just read ' + paper);
    },
    sundayPreNap: function (monthly) {
        console.log('About to fall asleep reading this ' + monthly);
    }
};

paper.subscribe(joe.drinkCoffee);
paper.subscribe(joe.sundayPreNap, 'monthly');

paper.daily();
paper.daily();
paper.daily();
paper.monthly();






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

function sortCoursesAndFilter (sortfn) {
    console.log("WHAT IS THIS");
    console.log(this);
    console.log(sortfn);
    console.log(databases);
    this.click();
    databases.courses.sort(sortfn());
    let p = makeReloadCoursesPromise(databases.courses);
    p.then(coursesFilter);
};



document.addEventListener("DOMContentLoaded", function () {

    divs.divCourses = document.getElementById('courses');
    divs.divSideboxes = document.getElementById('sideboxes');
    divs.divPagetitle = document.getElementById('pagetitle');

    divs.divPagetitle.setTitle = function (title) {
            console.log("TITLE");
            console.log(title);
            divs.divPagetitle.textContent = title;
        };


    let p3 = new Promise((resolve, reject) => {

        var boxesArray = [];

        boxesArray = [{"title": "PERIOD", "titleid": "periodcheckboxes"}, {"title": "PROGRAM", "titleid": "programcheckboxes"}, {"title": "DEPARTMENT", "titleid": "departmentcheckboxes"}, {"title": "YEAR", "titleid": "yearcheckboxes"}];

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
   
        boxAdder(frameObjs, parentGetterMaker('sideboxes'), childBuilderMaker(createFrameDivFn));


        divs.divPeriodcheckboxes = document.getElementById('periodcheckboxes');
        divs.divProgramcheckboxes = document.getElementById('programcheckboxes');
        divs.divDepartmentcheckboxes = document.getElementById('departmentcheckboxes');
        divs.divYearcheckboxes = document.getElementById('yearcheckboxes');


    
    
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
    
        boxAdder(periodCheckboxObjs, parentGetterMaker('periodcheckboxes'), childBuilderMaker(createCheckboxesDivFn));


    
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
    
        boxAdder(programCheckboxObjs, parentGetterMaker('programcheckboxes'), childBuilderMaker(createCheckboxesDivFn));


    
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
    
        boxAdder(departmentCheckboxObjs, parentGetterMaker('departmentcheckboxes'), childBuilderMaker(createCheckboxesDivFn));



    
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
    
        boxAdder(yearCheckboxObjs, parentGetterMaker('yearcheckboxes'), childBuilderMaker(createCheckboxesDivFn));




        // BUILD MAIN


        var boxesArray = [];
        
        boxesArray = [{"lables": ["COURSE2", "PERIOD", "PROGRAM", "YEAR", "EXAMINER", "RESPONSIBLE"]}];

        var frameObjs = [];

        boxesArray.forEach(function(box) {
            let frameObj = {
                "type": "class",
                "typevalue": "table-tesla__table__headerbox",
                "lables": box.lables
            }
            frameObjs.push(frameObj);
        })
    
        boxAdder(frameObjs, parentGetterMaker('courses'), childBuilderMaker(createMainCoursesDivFn));





        var sorterAdderArray = [
            {
                prop: "divSort_courses", 
                id: "sort_courses", 
                compareFn: compareCoursesToggle
            },
            {
                prop: "divSort_examiner", 
                id: "sort_examiner", 
                compareFn: compareExaminerToggle
            },
            {
                prop: "divSort_responsible", 
                id: "sort_responsible", 
                compareFn: compareResponsibleToggle
            }
        ]

        sorterAdderArray.forEach(function(item) {
            divs[item.prop] = document.getElementById(item.id);

            makePublisher(divs[item.prop]);
            
            divs[item.prop].click = function () {
                this.publish(this.children[0].textContent, "click");
            }
        
            divs[item.prop].subscribe(divs.divPagetitle.setTitle, 'click');
    
            divs[item.prop].addEventListener('click', sortCoursesAndFilter.bind(divs[item.prop], item.compareFn));

        });



        resolve();
        

      });
    

    Promise.all([p3]).then(function (res) {
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



    // Get new data regularly and update objects

    setInterval(function(){ 
        RequestObjectAndDoStuff('api/courses').then((objs) => {
            
                    var newobjs = [];
            
                    objs.forEach(function (param) {
                        var testobj = objfactory(param);
                        //console.log(testobj.examiner.firstname);
                        newobjs.push(testobj);
                        //console.log(testobj.code + ' ' + testobj.id);
                    });
                    
                    databases.courses = newobjs;
                    //events.sendOnReloadCourses();
                });
    }, 10000);

});






var pubishers = {};


/* When document ready, set click handlers for the filter boxes */
function setupEventListeners() {
    //var divCourses = document.getElementById('courses');
    var divCourses = divs.divCourses;
    divCourses.addEventListener('onReloadCourses', function () {
        databases.courses.sort(compareCoursesToggle());
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
