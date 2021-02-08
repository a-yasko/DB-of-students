(() => {
    // Константы
    const tbody = document.querySelector('#table-students tbody'),
          theads = document.querySelectorAll('#table-students thead tr th'),
          formAddStudents = document.querySelector('#form-students'),
          inputs = document.querySelectorAll('#form-students input'),
          inputSurname = document.querySelector('#surname'),
          inputName = document.querySelector('#name'),
          inputMiddleName = document.querySelector('#middle-name'),
          inputDate = document.querySelector('#DOB'),
          inputStartLearn = document.querySelector('#start-learn'),
          inputFaculty = document.querySelector('#faculty'),
          errorMsg = document.querySelector('#error-msg'),
          btnAddStudent = document.querySelector('#btn-add-student'),
          formFiltersInputs = document.querySelectorAll('#filters input'),
          DATE = new Date();

    // Массив со студентами
    const students = [
        {
            name: 'кристина',
            surname: 'ясько',
            middleName: 'дмитриевна',
            DOB: new Date(Date.UTC(1995, 5, 3)),
            yearOfStartOfLearn: 2013,
            faculty: 'экономический'
        },
        {
            name: 'елена',
            surname: 'гранкина',
            middleName: 'максимовна',
            DOB: new Date(Date.UTC(2002, 10, 17)),
            yearOfStartOfLearn: 2020,
            faculty: 'транспорт и логистика'
        },
        {
            name: 'александр',
            surname: 'ясько',
            middleName: 'евгеньевич',
            DOB: new Date(Date.UTC(1996, 4, 11)),
            yearOfStartOfLearn: 2017,
            faculty: 'физико-математический'
        },
        {
            name: 'андрей',
            surname: 'павлюченков',
            middleName: 'сергеевич',
            DOB: new Date(Date.UTC(1993, 9, 11)),
            yearOfStartOfLearn: 2009,
            faculty: 'технический'
        },
        {
            name: 'дмитрий',
            surname: 'панитевский',
            middleName: 'сергеевич',
            DOB: new Date(Date.UTC(1995, 7, 18)),
            yearOfStartOfLearn: 2013,
            faculty: 'экономический'
        },
    ];

    let arrWithFilters;
    let studentsNew;

    // Проверяем, есть ли что-то в localStorage, если есть, то подгружаем в массив studentsNew, 
    // если нет, то помещаем в studentsNew исходный массив students
    studentsNew = JSON.parse(localStorage.getItem('students'));
    if (studentsNew) {

    } else {
        studentsNew = Object.assign(students);
    }

    // Обновляем localStorage
    function updateLocalStorage() {
        localStorage.setItem('students', JSON.stringify(studentsNew));
        studentsNew = JSON.parse(localStorage.getItem('students'));
        // Преобразуем дату в объект Date
        for (const student of studentsNew) {
            student.DOB = new Date(student.DOB);
        }
    }

    updateLocalStorage();
    
    // Отрисовка таблицы
    function displayTable(arr) {
        for (const student of arr) {
            // Форматируем дату рождения
            let dd = student.DOB.getDate(),
                mm = student.DOB.getMonth() + 1,
                yyyy = student.DOB.getFullYear();

            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            // Вычисляем возраст
            const DOBNow = new Date(DATE.getFullYear(), student.DOB.getMonth(), student.DOB.getDate());
            let age = DATE.getFullYear() - student.DOB.getFullYear();
            if (DATE < DOBNow) age = age - 1;
            let year;
            if (String(age)[1] === '4') {
                year = 'года';
            } else if (String(age)[1] === '1') {
                year = 'год';
            } else {
                year = 'лет';
            }

            // Вычисляем курс
            let course = `${DATE.getFullYear() - student.yearOfStartOfLearn} курс`;
            if (DATE.getFullYear() - student.yearOfStartOfLearn > 4 || (DATE.getFullYear() === student.yearOfStartOfLearn + 4 && DATE.getMonth() === 8)) {
                course = 'закончил';
            } else if (student.yearOfStartOfLearn === DATE.getFullYear()) {
                course = '1 курс';
            }

            // Отрисовываем строку в таблице
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.surname.substr(0, 1).toUpperCase() + student.surname.substr(1).toLowerCase()} ${student.name.substr(0, 1).toUpperCase() + student.name.substr(1).toLowerCase()} ${student.middleName.substr(0, 1).toUpperCase() + student.middleName.substr(1).toLowerCase()}</td>
                <td>${student.faculty.substr(0, 1).toUpperCase() + student.faculty.substr(1).toLowerCase()}</td>
                <td>${dd}.${mm}.${yyyy} (${age} ${year})</td>
                <td>${student.yearOfStartOfLearn}-${student.yearOfStartOfLearn + 4} (${course})</td>
            `;

            tbody.append(tr);
        }
    }

    displayTable(studentsNew);

    // Форма добавления студента
    function addStudent() {
        // Формируем сегодняшнюю дату для inputDate
        let dd = DATE.getDate(),
            mm = DATE.getMonth() + 1;

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        inputDate.setAttribute('max', `${DATE.getFullYear()}-${mm}-${dd}`);

        // Добавляем обработчик событий на кнопку
        btnAddStudent.addEventListener('click', (e) => {
            // Убираем стандартное событие
            e.preventDefault();

            // Проверяем поля формы на заполнение и корректность
            if (inputSurname.value.trim() && 
            inputName.value.trim() && 
            inputMiddleName.value.trim() && 
            inputDate.valueAsDate !== null && 
            inputDate.valueAsDate.getFullYear() >= 1900 && 
            inputStartLearn.value.trim() && 
            inputStartLearn.value >= 2000 && 
            inputStartLearn.value <= DATE.getFullYear() && 
            inputFaculty.value.trim()) {
                studentsNew.push({
                    name: inputName.value.trim().toLowerCase(),
                    surname: inputSurname.value.trim().toLowerCase(),
                    middleName: inputMiddleName.value.trim().toLowerCase(),
                    DOB: new Date(Date.UTC(inputDate.valueAsDate.getFullYear(), inputDate.valueAsDate.getMonth(), inputDate.valueAsDate.getDate())),
                    yearOfStartOfLearn: Number(inputStartLearn.value),
                    faculty: inputFaculty.value.trim().toLowerCase()
                });
    
                tbody.innerHTML = '';
                updateLocalStorage();
                displayTable(studentsNew);
                formAddStudents.reset();
                errorMsg.textContent = '';
            } else {
                let arrWithFields = [];
                for (const input of inputs) {
                    if (!input.value) {
                        arrWithFields.push(input.name);
                    }
                }
                if (arrWithFields.length > 0) {
                    errorMsg.textContent = 'Вы не заполнили поля:' + ' ' + arrWithFields.join(', ') + '.';
                } else {
                    errorMsg.textContent = 'Вы некорректно заполнили поля "Дата рождения" или "Год начала обучения"';
                }
            }
        });
    }

    addStudent();

    // Сортировка по заголовкам таблицы
    function sortTheads() {
        // Сортировка по ФИО
        let countClick1 = 0;
        theads[0].addEventListener('click', () => {
            tbody.innerHTML = '';
            function sortFIO(arr, arg1, arg2, arg3) {
                displayTable(arr.sort((a, b) => {
                    if (a.surname + a.name + a.middleName < b.surname + b.name + b.middleName) return arg1;
                    if (a.surname + a.name + a.middleName > b.surname + b.name + b.middleName) return arg2;
                    return 0;
                }));
                theads[0].textContent = `ФИО студента ${arg3}`;
                theads[1].textContent = 'Факультет';
                theads[2].textContent = 'Дата рождения и возраст';
                theads[3].textContent = 'Годы обучения и номер курса';
            }
            if (arrWithFilters) {
                if (countClick1 === 0) {
                    countClick1 = 1;
                    sortFIO(arrWithFilters, -1, 1, '↓');
                } else if (countClick1 === 1) {
                    countClick1 = 0;
                    sortFIO(arrWithFilters, 1, -1, '↑');
                }
            } else {
                if (countClick1 === 0) {
                    countClick1 = 1;
                    sortFIO(studentsNew, -1, 1, '↓');
                } else if (countClick1 === 1) {
                    countClick1 = 0;
                    sortFIO(studentsNew, 1, -1, '↑');
                }
            }
        });

        // Сортировка по факультету
        let countClick2 = 0;
        theads[1].addEventListener('click', () => {
            tbody.innerHTML = '';
            function sortFaculty(arr, arg1, arg2, arg3) {
                displayTable(arr.sort((a, b) => {
                    if (a.faculty < b.faculty) return arg1;
                    if (a.faculty > b.faculty) return arg2;
                    return 0;
                }));
                theads[0].textContent = 'ФИО студента';
                theads[1].textContent = `Факультет ${arg3}`;
                theads[2].textContent = 'Дата рождения и возраст';
                theads[3].textContent = 'Годы обучения и номер курса';
            }
            if (arrWithFilters) {
                if (countClick2 === 0) {
                    countClick2 = 1;
                    sortFaculty(arrWithFilters, -1, 1, '↓');
                } else if (countClick2 === 1) {
                    countClick2 = 0;
                    sortFaculty(arrWithFilters, 1, -1, '↑');
                }
            } else {
                if (countClick2 === 0) {
                    countClick2 = 1;
                    sortFaculty(studentsNew, -1, 1, '↓');
                } else if (countClick2 === 1) {
                    countClick2 = 0;
                    sortFaculty(studentsNew, 1, -1, '↑');
                }
            }
        });

        // Сортировка по дате рождения и возрасту
        let countClick3 = 0;
        theads[2].addEventListener('click', () => {
            tbody.innerHTML = '';
            function sortDOB(arr, arg1, arg2, arg3) {
                displayTable(arr.sort((a, b) => {
                    if (a.DOB < b.DOB) return arg1;
                    if (a.DOB > b.DOB) return arg2;
                    return 0;
                }));
                theads[0].textContent = 'ФИО студента';
                theads[1].textContent = 'Факультет';
                theads[2].textContent = `Дата рождения и возраст ${arg3}`;
                theads[3].textContent = 'Годы обучения и номер курса';
            }
            if (arrWithFilters) {
                if (countClick3 === 0) {
                    countClick3 = 1;
                    sortDOB(arrWithFilters, 1, -1, '↓');
                } else if (countClick3 === 1) {
                    countClick3 = 0;
                    sortDOB(arrWithFilters, -1, 1, '↑');
                }
            } else {
                if (countClick3 === 0) {
                    countClick3 = 1;
                    sortDOB(studentsNew, 1, -1, '↓');
                } else if (countClick3 === 1) {
                    countClick3 = 0;
                    sortDOB(studentsNew, -1, 1, '↑');
                }
            }
        });

        // Сортировка по годам обучения
        let countClick4 = 0;
        theads[3].addEventListener('click', () => {
            tbody.innerHTML = '';
            function sortStartYear(arr, arg1, arg2, arg3) {
                displayTable(arr.sort((a, b) => {
                    if (a.yearOfStartOfLearn < b.yearOfStartOfLearn) return arg1;
                    if (a.yearOfStartOfLearn > b.yearOfStartOfLearn) return arg2;
                    return 0;
                }));
                theads[0].textContent = 'ФИО студента';
                theads[1].textContent = 'Факультет';
                theads[2].textContent = 'Дата рождения и возраст';
                theads[3].textContent = `Годы обучения и номер курса ${arg3}`;
            }
            if (arrWithFilters) {
                if (countClick4 === 0) {
                    countClick4 = 1;
                    sortStartYear(arrWithFilters, -1, 1, '↓');
                } else if (countClick4 === 1) {
                    countClick4 = 0;
                    sortStartYear(arrWithFilters, 1, -1, '↑');
                }
            } else {
                if (countClick4 === 0) {
                    countClick4 = 1;
                    sortStartYear(studentsNew, -1, 1, '↓');
                } else if (countClick4 === 1) {
                    countClick4 = 0;
                    sortStartYear(studentsNew, 1, -1, '↑');
                }
            }
        });
    }

    sortTheads();

    // Фильтры
    function filters() {
        formFiltersInputs.forEach(i => {
            i.addEventListener('input', () => {
                arrWithFilters = studentsNew.filter(FIO => (FIO.surname + ' ' + FIO.name + ' ' + FIO.middleName).includes(formFiltersInputs[0].value.trim().toLowerCase()))
                .filter(faculty => faculty.faculty.includes(formFiltersInputs[1].value.trim().toLowerCase()))
                .filter(startYear => String(startYear.yearOfStartOfLearn).includes(String(formFiltersInputs[2].value)))
                .filter(endYear => String(endYear.yearOfStartOfLearn + 4).includes(String(formFiltersInputs[3].value)));
                tbody.innerHTML = '';
                displayTable(arrWithFilters);
            });
        });
    }

    filters();
})();