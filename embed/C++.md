

# C++

### 语法基础

#### 基础知识

~~~c++
#include<iostream>
using namespace std;

int main(void)
{
    int a;
    cin >> a;  //标准输入
    cout << a << endl; //标准输出
    return 0;
}
~~~

1. 输入流通常连接到键盘、存储设备以及程序

2. 使用提取符(<<)可以输出各种基本数据类型的变量的值，也可以输出指针值

3. 使用new运算符开辟存储空间后，必须使用delete运算符撤销相应的空间。

4. int i; int &ri=i；对于这条语句，ri和i这两个变量代表的是同一个存储空间。

5. C++对C语言作了很多改进，引进了**类和对象的概念**使得C语言发生了质变，从面向过程变成了面向对象。

6. cout 是由I/O 流库预定义的**对象**

7. 以下程序中，new语句干了什么

   ~~~c++
   int** num;
   num = new int*[20];
   ~~~

   答：分配了长度为20的整数指针数组空间，并将num[0]的指针返回

8. 对于一个指针，不可以多次运用delete运算符
9. 重载函数在调用时选择的依据是函数的参数、参数的类型和函数的名字
10. 定义重载函数的要求是**参数的个数不同**，**参数中至少有一个类型不同**，**参数个数相同时，参数类型不同**
11. cout 是由I/O 流库预定义的对象
12. cin用于读入用户输入的数据
13. cout用于输出数据
14. cout通常与<<运算符结合
15. 在C++中，cin是**预定义的对象**

#### 函数重载

~~~c++
#include<iostream>
using namespace std;
int myMax(int a,int b)
{
    return a>b?a:b;
}

int myMax(int a,int b,int c)
{
    if(a>b && a>c) return a;
    else if(b>a && b>c) return b;
    else return c;
}

double myMax(double a,double b)
{
    return a>b?a:b;
}


int main(){
    cout<<myMax(3,4)<<endl;
    cout<<myMax(3,4,5)<<endl;
    cout<<myMax(4.3,3.4)<<endl;
}

~~~

1. 函数调用中的参数类型必须与函数原型的参数列表中相应参数的类型匹配
2. 函数的参数个数和类型都相同，只是返回值不同，这不是重载函数。
3. using namespace std; 这条语句的作用是将命名空间std内的**所有标识符暴露在当前作用域内**。
4. **通过命名空间可以区分具有相同名字的函数**
5. 在C++语言中引入内联函数（inline function）的主要目的是**解决程序中函数调用的效率问题。**
6. 设void f1(int * m，long & n)；int a；long b；合法调用是f1(&a，b)；
7. 内联函数在编译时是将该函数的目标代码插入每个调用该函数的地方
8. 命名空间应用于避免各个不同函数、变量等的名称冲突
9. 重载函数可以带有默认值参数，但是要注意**二义性**。
10. using namespace std; 这条语句的作用是将命名空间std内的所有标识符暴露在当前作用域内。
11. 符号常量在定义时一定要初始化。
12. 如果在函数中定义的局部变量与命名空间中的变量同名时，**命名空间中的变量**被隐藏。
13. 如果程序中使用了using命令同时引用了多个命名空间，并且命名空间中存在相同的函数，将出现**编译错误**

#### 类

1. 给定以下类声明，哪个成员函数可能改变成员变量data?

class A {

public:

```c++
 void f1 (int d);
 void f2 (const int &d);
 void f3 (int d) const;
```

private:

```c++
   int data;
```

};

f1和f2

2. public说明类中公有成员
3. 一个类**不**只有一个对象
4. 类成员的**默认访问属性**是**private**
5. 在面向对象的软件系统中，不同类对象之间的通信的一种构造称为**消息**
6. 类的实例化是指**定义对象**
7. 成员函数一定是内联函数是**错误**的
8. 在面向对象系统中，对象是基本的运行时实体，它**把属性和行为封装为一个整体**
9. 在面向对象系统中，对象的属性是**和其他对象相互区分的特性**

##### 例题

**6-1 设计一个名为Rectangle的矩形类（C++ set函数）**

分数 10

作者 张德慧

单位 西安邮电大学

设计一个名为Rectangle的矩形类，这个类包括：两个名为width和height的double数据域，它们分别表示矩形的宽和高。一个为width和height设置初值的函数set( )；一个名为getArea( )的函数返回矩形的面积；一个名为getPerimeter( )的函数返回矩形的周长。请实现这个类。

###### 类名为：

```c++
Rectangle
```

###### 裁判测试程序样例：

```c++
在这里给出函数被调用进行测试的例子。例如：
#include <iostream>
using namespace std;
//你提交的代码将嵌入到这里
 
int main()
{    
    double m,n;
    cin>>m;
    cin>>n;
    Rectangle a;
    a.set(m,n);
    cout<<a.getArea()<<endl;
    cout<<a.getPerimeter()<<endl;
    return 0;
}
```

###### 输入样例：

```in
3.5 35.9
```

###### 输出样例：

```out
125.65
78.8
```

###### 代码如下：

~~~c++
class Rectangle
{
public:
    double width = 0;
    double height = 0;
    void set(double a,double b)
    {
        width = a;
        height = b;
    }
    double getArea(void)
    {
        return width*height;
    }
    double getPerimeter(void)
    {
        return 2*(width+height);
    }
};
~~~



### 构造函数和析构函数

#### 基础知识

1. C++程序中，类的构造函数名与类名相同。

2. 在C++语言中引入内联函数（inline function）的主要目的是**解决程序中函数调用的效率问题。**

3. 对于有返回值的return语句,用它可以返回一个表达式的值,从而实现函数之间的信息传递

4. 形参 **int fun(int a=1,int b,int c=2)**合法

5. 所有类都应该有**构造函数和析构函数**

6. 一个类只能定义一个析构函数，但可以定义多个构造函数

7. **析构函数**不能重载

8. C++程序中，一个类的**构造函数**可以被重载。

9. 重载函数中**可以**使用默认参数

10. 在下面类声明中，关于生成对象不正确的是（ ）。
    class point
    { public:
    int x;
    int y;
    point(int a,int b) {x=a;y=b;}
    };

    **point *p=new point[2];**不正确

8. 设A为自定义类，现有普通函数int fun(A& x)。则在该函数被调用]时**无需初始化形参x**
9. 析构函数**不可以返回任何值**
10. 建立一个类对象时，系统自动调用**构造函数**
11. 类的析构函数特征是**一个类中只能定义一个析构函数**
12. 不是类的成员函数的是**友元函数**
13. 类是对象的抽象，而一个对象则是其对应的一个**实例**
14. 在面向对象程序设计方法中，对象是系统中用来描述客观事物的一个实体，它由 **数据**和可执行的一组操作共同组成。

#### 例题

**6-4 体育俱乐部I（构造函数）**

分数 5

作者 何振峰

单位 福州大学

一个俱乐部需要保存它的简要信息，包括四项：名称（字符串），成立年份（整数），教练姓名（字符串）和教练胜率（0－100之间的整数）。用键盘输入这些信息后，把它们分两行输出：第一行输出名称和成立年份，第二行输出教练姓名和胜率。

###### 裁判测试程序样例：

```c++
#include <iostream>
#include <string>
using namespace std;
class Coach{
    string name;
    int winRate;
public:
    Coach(string n, int wr){
        name=n; winRate=wr;
    }
    void show();
};
class Club{
    string name;
    Coach c;
    int year;
public:
    Club(string n1, int y, string n2, int wr);
    void show();
};
int main(){
    string n1, n2;
    int year, winRate;
    cin>>n1>>year>>n2>>winRate;
    Club c(n1,year, n2, winRate);
    c.show();
    return 0;
}

/* 请在这里填写答案 */
```

###### 输入样例：

```in
Guanzhou 2006 Tom 92
```

###### 输出样例：

```out
Guanzhou 2006
Tom 92%
```

###### 代码：

~~~c++
void Coach::show()
{
    cout<<name<<" "<<winRate<<"%"<<endl;
}

Club :: Club(string n1,int y,string n2,int wr):c(n2,wr)
{
    name = n1;
    year = y;
}

void Club::show()
{
    cout<<name<<" "<<year<<endl;
    c.show();
}
~~~



### 对象数组和对象指针

#### 基础知识

1. 静态成员的特点是不管这个类创建了多少个对象,其静态成员在内存中只保留一份副本,这个副本为该类的所有对象共享,或者说静态成员为类所有。
2. 静态数据成员不能在类中初始化，使用时需要在类体外声明。
3. 类的非静态成员函数才有this指针
4. 在静态成员函数中不能使用this指针
5. 静态数据成员初始化必须在**类外**进行。
6. 除了可以通过对象名来引用静态成员，还可以使用**类名**
7. 对象数组生命期结束时,对象数组的每个元素的析构函数并不会都被调用。
8. 若new一个对象数组,那么用delete释放时应该写[]，否则只delete一个对象(调用一次析构函数)。
9. const成员函数内部**可以**使用this指针
10. 对象数组的下标是从零开始的
11. 对象数组的数组名是一个常量指针
12. 对象数组的每个元素是同一个类的对象
13. 在构造函数内部可以使用this指针
14. 在析构函数内部可以使用this指针
15. 成员函数内的this指针指向成员函数所作用的对象

#### 例题

###### **6-2 各省总销量及最高销量（对象数组）**

分数 10

作者 徐婉珍

单位 广东东软学院

某手机厂商对其在n个城市的销量进行统计分析，现依次输入n个城市的省份名称、城市名称及销量，题目保证同一省份的数据将连续输入，要求输出各省的总销量及各省销量最高的城市名称及其销量，请根据给出的部分代码及输入输出的要求，按照注释中的任务提示，将代码补充完整。

###### 裁判测试程序样例：

```c++
#include <iostream>
using namespace std;
class Sale {
    private:
        string prov,city;//省份，城市
        double volume; //销量
    public:
        void setProv(string p);        
        void setCity(string c);
        void setVolume(double v);
        string getProv();
        string getCity();
        double getVolume();
};

int main() {
    int n;//城市个数
    cin>>n;
    Sale s[n];
    string prov;
    string city;
    double volume;
    for(int i=0; i<n; i++) {
        cin>>prov>>city>>volume;
        s[i].setProv(prov);
    /* 请根据下面的任务提示将代码补充完整，你的代码将被嵌入这里*/
    //1.输入各城市的销量
    //2.获取各省的总销量及最高销量的城市名称及其销量
   //3.在主函数外，补充Sale类中各函数的定义 
```

###### 输入样例：

第一行为城市总数，从第2行开始，将依次输入各城市的销量，格式为 "省份名称 城市名称 销量"，同一省份的数据将在连续的几行中输入，如下所示：

```in
5
gd foshan 8.5
gd guangzhou 13.6
gd shenzhen 10.5
zj hangzhou 11.3
zj jiaxing 12.3
```

###### 输出样例：

以如下的格式输出各省的总销量及最高销量的城市名称和该城市的销量。

```out
gd sum=32.6 max=guangzhou,13.6
zj sum=23.6 max=jiaxing,12.3
```

###### 代码：

~~~C++
		s[i].setVolume(volume);
		s[i].setCity(city);
	}
double sum=s[0].getVolume() ;
int max=0;
if(n==1)
cout<<s[max].getProv()<<" "<<"sum="<<sum<<" "<<"max="<<s[max].getCity() <<","<<s[max].getVolume()<<endl;
if(n>1)
{
	for(int i=1;i<n;i++)
	{
		if(s[i].getProv() ==s[max].getProv())
		{
			sum+=s[i].getVolume() ;
			if(s[i].getVolume()>s[max].getVolume())
			{
				max=i;
			}
		}
		if(s[i].getProv() !=s[max].getProv()) 
		{
		cout<<s[max].getProv()<<" "<<"sum="<<sum<<" "<<"max="<<s[max].getCity() <<","<<s[max].getVolume()<<'\n';
			max=i;
			sum=0;
			sum=s[max].getVolume();
			for(int i=max+1;i<=n;i++)
			{
				if(s[i].getProv() ==s[max].getProv()&&i!=n)
				{
					sum+=s[i].getVolume() ;
					if(s[i].getVolume()>s[max].getVolume())
					{
						max=i;
					 }
				
			}
			if(i==n)
					cout<<s[max].getProv()<<" "<<"sum="<<sum<<" "<<"max="<<s[max].getCity() <<","<<s[max].getVolume()<<'\n';}
		}

	}
}
}

void Sale::setProv(string p)
   {
   	prov=p;
   }
   void Sale::setCity(string c)
   {
   	city=c;
   }
   void Sale::setVolume(double v)
   {
   	volume=v;
   }
   string Sale::getProv()
   {
   	return prov;
   }
   string Sale::getCity()
   {
   	return city;
   }
   double Sale::getVolume()
   {
   	return volume;
   }
~~~



### 静态成员和友元

#### 基础知识

1. 静态数据成员不能在类中初始化，使用时需要在类体外声明。
2. 友元函数不是类的成员函数，只是独立于该类的一般函数。
3. 一个类的友元函数可以访问该类的私有成员。
4. 如果A是B的友元类,那么B的成员函数***不可以***访问A的私有成员。
5. 静态成员变量的访问控制权限**有意义**
6. 类与类之间的友元关系**不能**被继承
7. 友元函数可以在**类体内或类体外**定义
8. 引入友元的主要目的是为了**提高程序的效率和灵活性**
9. 静态数据成员是类的所有对象共享的数据
10. 在建立对象前，就可以为静态数据成员赋值
11. 静态数据成员初始化必须在**类外**进行
12. 静态成员函数没有**This指针**
13. 静态数据成员是**类的所有对象共享**的数据
14. 

#### 例题

###### **7-1 友元函数的练习**

分数 10

作者 赵晨

单位 浙江大学

定义Boat与Car两个类，两者都有私有的整型weight属性，定义两者的一个友元函数getTotalWeight()，计算二者的重量和。

参考主函数：
int main()
{
int n,m;
cin>>n>>m;
Boat boat(n);
Car car(m);
cout<<"船和汽车共重"<<getTotalWeight(boat,car)<<"吨"<<endl;
}

###### 输入格式:

请在这里写输入格式。例如：输入在一行中给出2个整数m和n。

###### 输出格式:

请在这里描述输出格式。例如：对每一组输入，在一行中输出:船和汽车共重M+n吨值。

###### 输入样例:

在这里给出一组输入。例如：

```in
40 30
```

###### 输出样例:

在这里给出相应的输出。例如：

```out
船和汽车共重70吨
```

###### 代码如下：

~~~c++
#include<iostream>
using namespace std;

class Boat;
class Car{
	friend class Boat;
private:
        int weight;
public:
        Car(int x)
        {
            weight=x;
        }
        friend int totalWeight(Car &c,Boat &m);

};

class Boat{
    friend class Car;
private:
        int weight;
public:
        Boat(int y)
        {
            weight=y;
        }
        friend int totalWeight(Car &c,Boat &m);
};

int totalWeight(Car &c,Boat &m)
{
    return c.weight+m.weight;
}


int main()
{
    int n,m;
    cin>>n>>m;
    Boat boat(n);
    Car car(m);
    cout<<"船和汽车共重"<<totalWeight(car,boat)<<"吨"<<endl;
}

~~~



### 字符串类

#### 基础知识

1. 静态数据成员不属于某个对象，在给对象分配存储空间时，不包括静态数据成员所占的空间。
2. 静态成员函数属于类而不是类的对象，没有this指针，静态成员函数中不能使用this指针。
3. 由于静态成员函数不属于某个特定的对象，因此。不能像一般的成员函数那样随意的访问对象中的非静态数据成员。只能引用类中声明的静态数据成员。如果要引用非静态数据成员，可通过对象引用。
4. 常数据成员的值必须初始化，且不能改变。
5. 常成员函数既可以被常对象调用，也可以被非常对象调用。
6. 使用C++标准string类定义一个字符串，需要包含的头文件string
7. get()函数不能从流中提取终止字符，终止字符仍留在流中。getline()函数可以从流中提取终止字符，但终止字符被丢弃
8. 下列String类的**substring()**方法返回指定字符串的一部分。
9. C++语言支持过程程序设计方法和**面向对象**设计方法。
10. 在C++中，实现封装性需借助于**类**

#### 例题

###### **7-1 字符串替换**

分数 10

作者 张德慧

单位 西安邮电大学

将文本文件中指定的字符串替换成新字符串。
由于目前的OJ系统暂时不能支持用户读入文件，我们编写程序从键盘输入文件中的内容，当输入的一行为end时，表示结束。end后面有两个字符串，要求用第二个字符串替换文本中所有的第一个字符串。

###### 输入格式:

Xi’an Institute of Posts and Telecommunications is co-designed and implemented by the People’s Government of Shaanxi Province and the Ministry of Industry and Information Technology.
The Institute is located in Xi’an, a historic city in Northwest China, famous for its magnificent ancient culture.

end （表示结束）

Institute （第一个字符串，要求用第二个字符串替换）

University （第二个字符串）

###### 输出格式:

Xi’an University of Posts and Telecommunications is co-designed and implemented by the People’s Government of Shaanxi Province and the Ministry of Industry and Information Technology.The University is located in Xi’an, a historic city in Northwest China, famous for its magnificent ancient culture.

###### 输入样例:

```in
Xi’an Institute of Posts and Telecommunications is co-designed and implemented by the People’s Government of Shaanxi Province and the Ministry of Industry and Information Technology.
The Institute is located in Xi’an, a historic city in Northwest China, famous for its magnificent ancient culture.
end
Institute
University
```

###### 输出样例:

```out
Xi’an University of Posts and Telecommunications is co-designed and implemented by the People’s Government of Shaanxi Province and the Ministry of Industry and Information Technology.The University is located in Xi’an, a historic city in Northwest China, famous for its magnificent ancient culture.
```

###### 代码如下：

~~~c++
#include<iostream>
#include<string>
using namespace std;

int main()
{
	string s1, s2, s3,s4;
	getline(cin, s1); 
	while (1)
	{
		getline(cin, s4); 
		int i = s4.compare("end");
		if (i == 0) break;
        s1 += "\n";
		s1 += s4;
	}
    s1 += "\n";
	cin >> s2;
	cin >> s3;
	int found = s1.find(s2);
	while (found != -1)
	{
		s1.replace(found,s2.length(),s3);
		found = s1.find(s2, found + 1);
	}
	cout << s1;

}

~~~





### 继承性：派生类

#### 基础知识

1. 在protected保护继承中，对于垂直访问等同于公有继承，对于水平访问等同于私有继承。
2. 类的组合关系可以用“Has-A”描述；类间的继承与派生关系可以用“Is-A”描述。
3. 建立派生类对象时, 3种构造函数分别是a(基类的构造函数)、b(成员对象的构造函数)、c(派生类的构造函数)，这3种构造函数的调用顺序为**abc**
4. 可以用p.a的形式访问派生类对象p的基类成员a, 其中a是**公有继承的公有成员**
5. 概括所有事物的共同特点，写一个基类。然后为每种事物写一个类，都从基派生而来
6. 在公有继承的情况下，在派生类中能够访问的基类成员包括**公有成员和保护成员**
7. 一个类的私有成员只能被该类的成员函数和友元函数访问
8. 在销毁派生类对象时，**先**调用**派生类**的析构函数，**再**调用**基类**的析构函数
9. 假设在公有派生情况下**不可以**将基类对象复制给派生类对象

#### 例题

**7-1 学生CPP成绩计算**

分数 10

作者 余春艳

单位 福州大学

给出下面的人员基类框架：

class Person
{

protected:

```
     string name;
     int age;
```

public:

```
     Person();      
     Person (string p_name, int p_age);
     void display () {cout<<name<<“:”<<age<<endl;}
```

};

建立一个派生类student,增加以下成员数据：

```
int ID;//学号
float cpp_score;//cpp上机成绩
float cpp_count;//cpp上机考勤
float cpp_grade;//cpp总评成绩
     //总评成绩计算规则：cpp_grade = cpp_score * 0.9 + cpp_count * 2;
```

增加以下成员函数：

student类的无参构造函数

student类的参数化构造函数//注意cpp_grade为上机成绩和考勤的计算结果

void print()//输出当前student的信息

```
                 //其中cpp_grade输出保留一位小数
                //输出格式为ID name cpp_grade
```

生成上述类并编写主函数，根据输入的学生基本信息，建立一个学生对象，计算其cpp总评成绩，并输出其学号、姓名、总评成绩。

输入格式： 测试输入包含若干测试用例，每个测试用例占一行（学生姓名 学号 年龄 cpp成绩 cpp考勤）。当读入0时输入结束，相应的结果不要输出。

输入样例：

Bob 10001 18 75.5 4

Mike 10005 17 95.0 5

0

输出样例：

10001 Bob 75.9

10005 Mike 95.5

###### 代码如下：

~~~c++
#include <iostream>
#include<string>
#include<iomanip>

using namespace std;
class Person{
protected:
     string n;
     int a;
public:
    Person(){};
    Person (string p_n, int p_a)
    {
        n=p_n;
        a=p_a; 
    };
     void display () {cout<<n<<":"<<a<<endl;}
};
class Student:public Person
{
int ID;
float cpp_score;
float cpp_count;
float cpp_grade;
public :
      Student(){}
      void print()
      {
          cpp_grade=cpp_grade = cpp_score * 0.9 + cpp_count * 2;
          cout<<ID<<" "<<n<<" "<<setiosflags(ios::fixed)<<setprecision(1)<<cpp_grade<<endl;
       }
      Student(string Name,int id,float a,float b)
      {
        n=Name;
        ID=id;
        cpp_score=a;
        cpp_count=b;
       }
      
};

int main()
{
    int ID;
    float cpp_score;
    float cpp_count;
    string name;
    int age;
    cin >> name ;
    while(name!="0")
    {
        cin >> ID >>age>> cpp_score >>cpp_count;
        Student a(name,ID,cpp_score,cpp_count);
        a.print();
        cin >> name ;
    }
    return 0;
}
~~~



### 多继承

#### 基础知识

1. 面向对象程序设计的继承性鼓励程序员重用被实践验证的高质量软件。
2. 多重继承派生类的构造函数，需要调用所有的基类构造函数来完成各基类数据成员的初始化。
3. 在C++语言中设置虚基类的目的是**解决多继承造成的二义性问题**
4. 一个基类可以有多个派生类，一个派生类可以有多个基类。
5. 继承是父类和子类之间共享数据和方法的机制
6. 继承定义了一种类与类之间的关系
7. 继承关系中的子类将拥有父类的全部属性和方法
8. 析构函数不能被继承
9. 派生类是基类的组合
10. 派生类的成员除了它自己的成员外，还包含了它的基类的成员

#### 例题

**7-1 日程安排（多重继承+重载）**

分数 12

作者 余春艳

单位 福州大学

已有一个日期类Date，包括三个protected成员数据

int year;

int month;

int day;

另有一个时间类Time，包括三个protected成员数据

int hour;

int minute;

int second;

现需根据输入的日程的日期时间，安排前后顺序，为此以Date类和Time类为基类，建立一个日程类Schedule，包括以下新增成员：

int ID；//日程的ID

bool operator < (const Schedule & s2);//判断当前日程时间是否早于s2

生成以上类，并编写主函数，根据输入的各项日程信息，建立日程对象，找出需要最早安排的日程，并输出该日程对象的信息。

输入格式： 测试输入包含若干日程，每个日程占一行（日程编号ID 日程日期（****/**/\**）日程时间（\**:**:**））。当读入0时输入结束，相应的结果不要输出。

输入样例：

1 2014/06/27 08:00:01

2 2014/06/28 08:00:01

0

输出样例：

The urgent schedule is No.1: 2014/6/27 8:0:1

###### 代码如下：

~~~c++
#include<iostream>
using namespace std;
class Date{
    protected:
    int year;
    int month;
    int day;
    public:
    Date(int a,int b,int c):year(a),month(b),day(c){};
};
class Time{
    protected:
    int hour;
    int minute;
    int second;
    public:
    Time(int a,int b,int c):hour(a),minute(b),second(c){};
};
class Schedule:public Date,public Time{
    private:
    int ID;
    public:
    Schedule(int a=0,int b=0,int c=0,int d=0,int e=0,int f=0,int g=0):ID(a),Date(b,c,d),Time(e,f,g){};
    bool operator <(const Schedule &s2){
        if(year<s2.year){
            return true;
        }else if(year>s2.year){
            return false;
        }else if(month<s2.month){
            return true;
        }else if(month>s2.month){
            return false;
        }else if(day<s2.day){
            return true;
        }else if(day>s2.day){
            return false;
        }else if(hour<s2.hour){
            return true;
        }else if(hour>s2.hour){
            return false;
        }else if(minute<s2.minute){
            return true;
        }else if(minute>s2.minute){
            return false;
        }else if(second<s2.second){
            return true;
        }else if(second>s2.second){
            return false;
        }else{
            return true;
        }
    };
    void display(){
        cout<<"The urgent schedule is No."<<ID<<": "<<year<<"/"<<month<<"/"<<day<<" "<<hour<<":"<<minute<<":"<<second;
    }
};
int main(){
    Schedule d1,d2;
    int a,b,c,d,e,f,g;
    char ch;
    cin>>a>>b>>ch>>c>>ch>>d>>e>>ch>>f>>ch>>g;
    d1=Schedule(a,b,c,d,e,f,g);
    cin>>a;
    while(a){
        cin>>b>>ch>>c>>ch>>d>>e>>ch>>f>>ch>>g;
        d2=Schedule(a,b,c,d,e,f,g);
        if(d2.operator<(d1)){
            d1=d2;
        }
        cin>>a;
    }
    d1.display();
    
    return 0;
}
~~~



### 运算符重载

#### 基础知识

1. 对单目运算符重载为友元函数时，可以说明一个形参。而重载为成员函数时，不能显式说明形参。
2. In C++, only existing operators can be overloaded.（在C++中，只有现有的运算符可以被重载）
3. 对每个可重载的运算符来讲，它既可以重载为友元函数，又可以重载为成员函数
4. 下列运算符中，**::**  和  **?:**  运算符不能重载。
5. 运算符重载不可以改变语法结构
6. 能用友元函数重载的运算符是**+**
7. 多数运算符可以重载，个别运算符不能重载，运算符重载是通过函数定义实现的。
8. 对单目运算符重载为友元函数时，可以说明一个形参。而重载为成员函数时，不能显式说明形参。
9. 在C++中只能对已经存在的运算符进行重载

#### 例题

###### **6-4 复数类重载加法、减法和乘法运算符**

分数 10

作者 傅尔胜

单位 郑州航空工业管理学院

以下定义了一个复数类及其部分实现，现要求将类的构造函数以及运算符+、- 和 * 函数重载补充完整。

###### 复数类定义：

```c++
在这里描述复数类定义。具体如下：
class complex {
    public:
        complex(float r=0,float i=0);                   // 构造函数
        complex operator+(const complex &op2) const;    //重载运算符 +
        complex operator-(const complex &op2) const;    //重载运算符 -
        complex operator*(const complex &op2) const;    //重载运算符 *
        void display() const;                           // 按数学写法输出复数
    private:
        float real;
        float imag;
};
```

###### 裁判测试程序样例：

```c++
在这里给出复数类测试的例子。例如：
#include <iostream>
using namespace std;
class complex {
    public:
        complex(float r=0,float i=0);                   // 构造函数
        complex operator+(const complex &op2) const;    //重载运算符 +
        complex operator-(const complex &op2) const;    //重载运算符 -
        complex operator*(const complex &op2) const;    //重载运算符 *
        void display() const;                           // 按数学写法输出复数
    private:
        float real;
        float imag;
};


/* ------------------- 请在这里填写答案--------------------  */


void complex::display() const {
    if(real&&imag)
        if(imag==1||imag==-1)
            cout<<real<<(imag>0?"+":"-")<<"i"<<endl;
        else
            cout<<real<<(imag>0?"+":"")<<imag<<"i"<<endl;
    else if(real)
        cout<<real<<endl;
    else if (imag)
        if(imag==1||imag==-1)
            cout<<(imag>0?"":"-")<<"i"<<endl;
        else
            cout<<imag<<"i"<<endl;
    else
        cout<<0<<endl;
}

int main() {
    double real,imag;
    complex c,d,e;

    cin>>real>>imag;
    complex c1(real,imag);
    cin>>real>>imag;
    complex c2(real,imag);

    c=c1+c2;
    d=c1-c2;
    e=c1*c2;
    c.display() ;
    d.display() ;
    e.display();

    return 0;
}
```

###### 输入样例：

在这里给出一组输入。例如：

```in
2 3
-4 -5
```

###### 输出样例：

在这里给出相应的输出。例如：

```out
-2-2i
6+8i
7-22i
```

#### 代码如下：

~~~c++
complex :: complex(float a, float b) {
    real = a;
    imag = b;
}
complex  complex :: operator+(const complex &o) const {
    complex Complex;
    Complex.imag = o.imag + imag;
    Complex.real = o.real + real;
    return Complex;
}
complex  complex :: operator-(const complex &o) const {
    complex Complex;
    Complex.imag =  imag - o.imag;
    Complex.real = real - o.real ;
    return Complex;
}
complex  complex :: operator*(const complex &o) const {
    complex Complex;
    Complex.imag =  imag * o.real + real * o.imag;
    Complex.real = real * o.real - imag * o.imag;
    return Complex;
}
~~~



### 虚函数

#### 基础知识

1. 虚函数是用virtual 关键字说明的成员函数。

2. 动态绑定是在运行时选定调用的成员函数的。

3. 构造函数**不可以**声明为虚函数。

4. 构造函数**不可以**声明为纯虚函数。

5. **虚函数**不能是类的**静态成员**。

6. 重定义虚函数的派生类必须是公有继承的。

7. 作为虚函数隐含参数的this指针，决定了虚函数调用时执行的代码。

8. 虚析构函数的作用是**delete动态对象时释放资源**

9. 在派生类中，重载一个虚函数时，要求函数名、参数的个数、参数的类型、参数的顺序和函数的返回值**应该相同**

10. 若一个类中含有纯虚函数，则该类称为**抽象类**

11. 动态绑定是在**运行时**（运行期间）确定操作函数的

12. 一个基类中说明有纯虚函数，该基类的派生类**可以**是抽象类，**也可以**是具有实例化对象的类

    
