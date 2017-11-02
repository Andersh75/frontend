function buildClasses(objs) {
    return new Promise(function (resolve, reject) {

        divs.divSideboxes.setAttribute("class", "schedule-tesla__right");
        divs.divCourses.setAttribute("class", "schedule-tesla__left");
        divs.divSideboxesRight.setAttribute("class", "schedule-tesla__right");

        databases.classes = objs;



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