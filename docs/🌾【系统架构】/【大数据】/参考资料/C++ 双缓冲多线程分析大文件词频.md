- [1、最开始](#1最开始)
- [2、多线程](#2多线程)
- [3、单 IO 线程](#3单-io-线程)
- [4、双缓冲](#4双缓冲)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.cnblogs.com](https://www.cnblogs.com/lekko/p/3370825.html)

实习生活告一段落，我正式从一名. NET 程序员转入 Java 阵营，不得不说刚开始用 Java 的东西是多么的不习惯，但是经过三个月的使用与开发，我也发现了 Java 的优势：不在于语言，而在于开源。这意味着有更多免费可用的东西，直接复用，但是研究它的人也可以通过代码深造自己的技术水平。

题外话说到这吧，很简单的一个问题，读取一个大型文件（可能超过内存），分析其中英文单词的词频，并输出结果。简化起见，我们假定编码不是 Unicode，而是 UTF-8 或者 ANSI，最快速度，榨干磁盘 IO 是关键所在。

## 1、最开始

一般来说，遇到这个问题，我们可能想法都是这样：

```
　　--------------　　　　　  ---------
　　|　　 File 　　|　　-->     | Buffer |　　-->  分析  -->  结果
　　--------------　　　　　  ---------
```

## 2、多线程

再下来就可以开辟多个线程，分段读取文件，并以同步的方式将分析结果保存起来：

```
　　　　　　　　　　　　　　  ---------
 　　　　　　　　　　　    　　| Buffer |　　--> 分析
　　　　　　　　　　　/  　　  ---------　　　　　　   \

　　--------------　　　　　  ---------
　　|　　 File 　　|　　-->     | Buffer |　　-->  分析  -->  结果
　　--------------　　　　　  ---------　　　　　　　 /

　　　　　　　　　　　\ 　　　....　　　　　-->   ...

```

　　这时有一个问题，如果保证分段时单词不被割断，如段落：...i love you...，如果正好选取在 v 上，那么 love 将会被拆成两个单词。对应的，我的解决办法是后搜机制：分割时，往后读 char，直到遇到非字母、数字时认为分割完成。

　　另外一个问题，结果的保存有两种方式，一种是同步机制，这会影响性能，但占用的内存空间小；另一种是各个线程维护一个结果集，然后在全部完成后结算，这种方式下速度更快，但会占用 N 倍于第一种的内存空间（N 是线程数）。在内存允许的情况下，我更倾向于第二种解决方案。

## 3、单 IO 线程

　　目前来说，程序各个线程都会有 IO 操作，无疑，这在磁盘 IO 只有 100Mb/s 左右的时候，增加了线程切换、IO 中断的开销，于是设计应该是统用一个大 Buffer（大小取决于内存大小），然后各个线程再在 Buffer 的 [start,end] 区间分段进行分析：

```sh
　　　　　　　　　　　　　　 　　　　　　　　　　　　 ---------
 　　　　　　　　　　　    　　　　　　　　　　　　　　| s1, e1|　　 -->  分析  -->  结果 1
　　　　　　　　　　　 　　　　　　　　　　　　 /  　　---------　　　　　　   　　　　　　 \
　　--------------　   IO 　   -------------　　　  　　---------
　　|　　 File 　　|  ------>　| Big Buffer |　　-->     | s2, e2 |　　-->  分析  -->  结果 2　--> 结果
　　----------------　    　   -------------　　　  　　 ---------
　　　　　　　　　　　　　　　　　　　　　　　　\ 　　　　....　　 　-->   ...　 -->   ...　　/
```

　　跟前面一样，[start, end] 形式的分段分析也存在割断单词的情况，所以也有后搜机制来保证单词不被截断。所幸分割数取决于线程数 N，而且由于单词长度有限，在内存内的后搜操作也非常迅速。总之与 IO 比起来，可以完全忽略了。

## 4、双缓冲

　　经过上面步骤的调整，IO 已经完全独立出来了，但是在读取一个 Buffer 后，IO 便会等待分析完成才会继续读入，有什么方法可以让 IO 线程在分析时也不停歇么？有，这便是双缓冲：

```sh
　　　　　　　　　　　　　　 　　　　　　　　　　　　 　　　　　---------
 　　　　　　　　　　　    　　　　　　　　　　　　　　　　　　　| s1, e1|　　 -->  分析  -->  结果 1
　　　　　　　　　　　 　　　　　　　　　　　　   　　 　　/  　　---------　　　　　　   　　　　　　 \
 　　　　　　　　　　　　　    ---------------　　　  　　　　　　---------
　　  　　　　　　　　　　　　| Big Buffer 1 |　-----||　--->     | s2, e2 |　　-->  分析  -->  结果 2　--> 结果
　　--------------　    /  　   ---------------　　切  　　　　　　---------　
　　|       File      |　　IO　    ---------------      换 　　　\ 　　　　.....　　   -->   ...　 -->   ...　　/
　　--------------       \        | Big Buffer 2 |　-----||
　　　　　　　　　　　　　　  ---------------
```

　　这种方式的优势在于，Buffer 1 在读入完成时，马上会进行分析，然后 Buffer 2 继续读入；当分析一个 Buffer 1 完成后，切换到另一个 Buffer 2 进行分析，然后 Buffer 1 继续进行读入。这就在一定程度上保证了 IO 的连贯性，充分利用 IO 资源（分析操作在内存中是相当快的）。

　　**最后**，我会附上我的代码，大家可以自己试着写下，其实跟算法没什么关系，主要是练习下多线程、IO 方面的基础知识，蛮有意思的。另外，我这份代码需要支持 C++ 11 标准的编译器才能编译的哦~~

![alt](https://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif)![alt](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif)

```cpp
#include <iostream>
#include <fstream>
#include <unordered_map>
#include <time.h>
#include <thread>
#include <cstring>
using namespace std;

struct CharCmp
{
    bool operator()(const char *str1,const char * str2) const
    {
        return strcmp(str1,str2) == 0;
    }
};

struct WordHash
{
    // BKDR hash algorithm
    int operator()(char * str) const
    {
        int seed = 131; // 31 131 1313 131313 etc..
        int hash = 0;
        while(*str)
            hash = hash * seed + (*str++);
        return hash & (0x7FFFFFFF);
    }
};

typedef unordered_map<char*, unsigned int, WordHash, CharCmp> HashMap;
typedef unordered_map<char*, unsigned int, WordHash, CharCmp>::iterator KeySet;

bool words[128];
int threadCount = 4;
streamsize loadsize = 536870912;    // 1024*1024*1024  1879048192 1610612736 1073741824 536870912 268435456
char* loadedFile[2];
HashMap* wordMaps;

// 声明
void readBlock(int,int,streamoff,streamsize);
streamsize inline getRealSize(ifstream*,streamoff,streamsize);
void inline readLoad(int,ifstream*,streamoff,streamsize);
streamsize inline getBlockSize(int,streamoff,streamsize);

int main(int argc, char *argv[]){

    ios::sync_with_stdio(false);
    if (argc==1)
    {
        cout<<"WordCount多线程统计词频程序\r\n  参数：\r\n    Path必需，ThreadNum可选(默认为4)\r\n    BufferSize可选(双缓冲,实际占用双倍,1879048192 1610612736 1073741824 536870912 268435456,默认512M)\r\n  Usage:  \tWordCount [Path] [ThreadNum] [BufferSize]\r\n  Example:\tWordCount input.txt"<<endl;
        exit(0);
    }
    if(argc>2)
        threadCount = atoi(argv[2]);
    if(argc>3)
        loadsize = atol(argv[3]);
    wordMaps = new HashMap[threadCount];
    char *filename = argv[1];
    // 双缓冲
    streamsize maxsize = loadsize+256;
    loadedFile[0] = new char[maxsize];
    loadedFile[1] = new char[maxsize];

    cout<<"Starting to calculate with "<< threadCount <<" threads..."<<endl;
    time_t t_start,t_end;
    t_start = time(NULL);

    // 初始化可识别字符
    memset(words,false,128);
    for (char c=97;c!=123;++c)
        words[c] = true;
    for (char c=65;c!=91;++c)
        words[c] = true;
    for (char c=48;c!=58;++c)
        words[c] = true;

    // 读取文件
    ifstream file;
    file.open(filename,ios::binary|ios::in);
    if (!file)
    {
        cout<<"Error: file \""<<filename<<"\" do not exist!"<<endl;    // 失败
        exit(1);
    }
    else
    {
        // 确认文件大小
        streamoff start=0;
        file.seekg(0,ios::end);
        streamoff size,len = file.tellg();
        if (len>3)
        {
            // 确认有无BOM
            char bom[3];
            file.seekg(0);
            file.read(bom,3);
            if (bom[0]==-17&&bom[1]==-69&&bom[2]==-65){
                start = 3;
                size = len - 3;
            }else
                size = len;
        }else
            size = len;
        // 读入文件数据到缓存
        thread* threads = new thread[threadCount];
        streamsize realsize;
        streamoff index,part;
        bool step = 0,needWait = false;
        while (size)
        {
            // 缓冲
            realsize = size>maxsize ? getRealSize(&file,start,loadsize) : size;
            readLoad(step,&file,start,realsize);
            start+=realsize;
            size-=realsize;
            // 等待
            if(needWait)
                for (int i=0;i<threadCount;++i) threads[i].join();
            else
                needWait = true;
            // 多线程计算
            index=0,part = realsize/threadCount;
            for (int i=1;i<threadCount;++i)
            {
                len = getBlockSize(step,index,part);
                // 开算
                threads[i] = thread(readBlock,step,i,index,len);
                index+=len;
            }
            threads[0] = thread(readBlock,step,0,index,realsize-index);
            // 转换
            step = !step;
        }
        // 清理
        for (int i=0;i<threadCount;++i) threads[i].join();
        delete loadedFile[0];
        delete loadedFile[1];
        file.close();    // 关闭
        // 结算累加
        HashMap* map = wordMaps;
        for (int i=1;i<threadCount;++i)
        {
            KeySet p=(wordMaps+i)->begin(),end=(wordMaps+i)->end();
            for (; p!=end; ++p)
                (*map)[p->first] += p->second;
        }
        // 输出
        cout<<"Done.\r\n\nDifferent words: "<< map->size()<<endl;
        KeySet p=map->begin(),end=map->end();
        long total = 0;
        for (; p!=end; ++p)
            total+=p->second;
        cout<<"Total words:"<<total<<endl;
        cout<<"\nEach words count:"<<endl;
        for (KeySet i = map->begin(); i!=map->end(); ++i)
            cout << i->first << "\t= " << i->second << endl;
        //out.close();
    }
    t_end = time(NULL);
    // 结束
    cout<<"\r\nAll completed in "<<difftime(t_end,t_start) <<"s."<<endl;
    return 0;
}

// 文件获取临界不截断的真正大小
streamsize inline getRealSize(ifstream* file,streamoff start,streamsize size)
{
    file->seekg(start+size);
    while (words[file->get()])
        ++size;
    return size;
}

// 文件读入到堆
void inline readLoad(int step,ifstream* file,streamoff start,streamsize size){
    file->seekg(start);
    file->read(loadedFile[step],size);
}

// 分块读取
void readBlock(int step,int id,streamoff start,streamsize size){
    char c = '\0';
    char word[128];
    int i = 0;
    HashMap* map = wordMaps + id;
    KeySet curr,end = map->end();
    char* filebuffer = loadedFile[step];
    streamsize bfSize = start + size;
    for (streamoff index = start;index!=bfSize;++index)
    {
        c= filebuffer[index];
        if (c>0 && words[c])
            word[i++] = c;
        else if (i>0)
        {
            word[i++] = '\0';
            // 先判断有没有
            if ((curr=map->find(word)) == end)
            {
                char* str = new char[i];
                memcpy(str,word,i);
                map->insert(pair<char*, unsigned int>(str,1));
            }else
                ++(curr->second);
            i = 0;
        }
    }
    if (i>0)
    {
        word[i++] = '\0';
        if ((curr = map->find(word))==end)
        {
            char* str = new char[i];
            memcpy(str,word,i);
            map->insert(pair<char*, unsigned int>(str,1));
        }else
            ++(curr->second);
    }
}

// 内存截断检查
streamsize inline getBlockSize(int step,streamoff start,streamsize size)
{
    char* p = loadedFile[step] + start + size;
    while (words[*p]){
        ++size;
        ++p;
    }
    return size;
}

```
