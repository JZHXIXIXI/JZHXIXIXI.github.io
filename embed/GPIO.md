## 一、GPIO

### 1.概述

GPIO（General-purpose input/output，通用输入输出端口）是stm32最基本的外设，作为一个合格的嵌入式开发工程师，要了如指掌！

### 2.工作原理

#### （1）输入输出模式

输入模式：上拉输入、下拉输入、浮空输入、模拟输入

输出模式：推挽输出、开漏输出、复用推挽输出、复用开漏输出

##### ①输入模式

###### 上拉输入

GPIO在没有连接外部部件时的默认电平是高电平（默认是3.3v）

###### 下拉输入

GPIO在没有连接外部部件时的默认电平是高电平

###### 浮空输入

GPIO接受输入信号，输入为高就为高，输入为低就为低

###### 模拟输入*

外部电平信号没有流入输入数据寄存器，模拟输入一般是用来**ADC**读取和转换的。

##### ②输出模式

###### 推挽输出

由寄存器控制输出的电平高低（一般都用到的都是推挽输出）

###### 开漏输出

输出的电压由外部的电阻决定

###### 复用推挽输出

推挽复用输出和推挽输出的区别在于信号来源，其信号来源是由复用功能相关的通信通道来控制

###### 复用开漏输出

开漏复用输出和开漏输出的区别在于信号来源，复用的来源不是内部直接通过输出数据寄存器写的，而是由复用功能的外设决定的

#### （2）介绍

GPIO最基本的输出功能是由STM32控制引脚输出高低电平，另外还有外部设备通信、控制以及采集和捕获的功能

#### （3）端口复用

为了最大限度的利用端口资源，STM32的大部分端口都具有复用功能，就是一些端口不仅仅可以做为通用IO口，还可以复用为一些外设引脚，记得看手册！！！！          

#### （4）端口重映射           

为了方便布线 ，STM32配有端口重映射功能，所谓重映射就是可以把某些功能引脚映射到其他引脚 ，记得看手册！！！！

### 3.GPIO相关寄存器

下面只是介绍一下，主要看手册

每个I/O端口寄存器**必须**按**32位字**被访问

STM32的每组GPIO都包含7个寄存器，分别是：

    GPIOx_CRL:端口配置低寄存器
    
    GPIOx_CRH:端口配置高寄存器
    
    GPIOx_IDR:端口输入寄存器
    
    GPIOx_ODR:端口输出寄存器
    
    GPIOx_BSRR:端口位设置/清除寄存器
    
    GPIOx_BRR :端口位清除寄存器
    
    GPIOx_LCKR:端口配置锁存寄存器

### 4.GPIO库函数配置

**注意：外设（包括GPIO)在使用之前，几乎都要先使能对应的时钟。**

```c
RCC_APB2PeriphColckCmd();
```

#### （1）GPIO_InitTypeDef结构体：

```c
typedef struct{
uint16_t GPIO_Pin;            //指定要初始化的IO口   
GPIOSpeed_TypeDef GPIO_Speed; //设置IO口输出速度    
GPIOMode_TypeDef GPIO_Mode;   //设置工作模式：8种中的一个
}
```

#### （2）GPIO输出速度：

```c
typedef enum {
GPIO_Speed_10MHz,
GPIO_Speed_2MHz,
GPIO_Speed_50MHz
}GPIOSpeed_TypeDef;
```

#### （3）GPIO模式：

```c
typedef enum{
GPIO_Mode_AIN = 0x0,          //模拟输入
GPIO_Mode_IN_FLOATING = 0x04, //浮空输入
GPIO_Mode_IPD = 0x28,         //输入下拉
GPIO_Mode_IPU = 0x48,         //输入上拉
GPIO_Mode_Out_OD = 0x14,      //开漏输出
GPIO_Mode_Out_PP = 0x10,      //推挽输出
GPIO_Mode_AF_OD = 0x1C,       //开漏复用输出
GPIO_Mode_AF_PP = 0x18        //推挽复用输出
}GPIOMode_TypeDef;
```

#### （4）初始化函数:

```c
void GPIO_Init(GPIO_TypeDef* GPIOx, GPIO_InitTypeDef* GPIO_InitStruct);
```

#### （5）重要函数：

```c
uint8_t GPIO_ReadInputDataBit(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);

uint16_t  GPIO_ReadInputData(GPIO_TypeDef* GPIOx);

uint8_t  GPIO_ReadOutputDataBit(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);

uint16_t  GPIO_ReadOutputData(GPIO_TypeDef* GPIOx);


void GPIO_SetBits(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);

void GPIO_ResetBits(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);

void GPIO_WriteBit(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin, BitAction BitVal);

void GPIO_Write(GPIO_TypeDef* GPIOx, uint16_t PortVal);
```



