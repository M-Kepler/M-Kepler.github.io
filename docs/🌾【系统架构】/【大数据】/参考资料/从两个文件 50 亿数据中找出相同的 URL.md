- [问题描述](#问题描述)
  - [方案 一](#方案-一)
  - [方案 二](#方案-二)
  - [思考](#思考)
- [算法实现](#算法实现)
  - [Step 1 产生 50 亿 URL](#step-1-产生-50-亿-url)
  - [Step 2 将 50 亿 URL 大文件哈希为 10000 个小文件](#step-2-将-50-亿-url-大文件哈希为-10000-个小文件)
    - [Step 2.1 字符串哈希函数 BKDRHash](#step-21-字符串哈希函数-bkdrhash)
    - [Step 2.2 获取文件大小](#step-22-获取文件大小)
    - [Step 2.3 获取某一目录下指定后缀的所有文件](#step-23-获取某一目录下指定后缀的所有文件)
  - [Step 3 使用 set 将小文件进行求交操作，最终得到相同 URL](#step-3-使用-set-将小文件进行求交操作最终得到相同-url)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.csdn.net](https://blog.csdn.net/qingdujun/article/details/82343756)

# 问题描述

给定 a、b 两个文件，各存放 50 亿个 url，每个 url 各占 64 字节，内存限制是 4G，让你找出 a、b 文件共同的 url

## 方案 一

每个文件 50 亿个 URL，每个 URL 最长 64 个字节，可以估计每个文件安的大小为 5000,000,000 ×64bit=320,000,000,000bit ≈ 300,000G，远远大于内存限制的 4G，同时需要大硬盘（这里不考虑分布式计算）。所以不可能将其完全加载到内存中处理。考虑采取分而治之的方法。

- 遍历文件 a，对每个 url 求取  `hash(url) % 100000`，然后根据所取得的值将 url 分别存储到 100000 个小文件（记为 a0, a1, a2, . . . , a99998 , a99999）中。这样每个小文件的大约为 3G。

- 遍历文件 b，采取和 a 相同的方式将 url 分别存储到 10000 小文件中（记为 b0, b1, b2, . . . , b99998, b99999）。这样处理后，所有可能相同的 url 都在对应的小文件（ a0 vs b 0 , a1 vs b1 , . . . , a 99999 vs b99999）中，不对应的小文件不可能有相同的 url。然后我们只要求出 10000 对小文件中相同的 url 即可。

- 求每对小文件中相同的 url 时，可以把其中一个小文件的 url 存储到 hash_set 中。然后遍历另一个小文件的每个 url，看其是否在刚才构建的 hash_set 中，如果是，那么就是共同的 url，存到文件里面就可以了。

## 方案 二

如果允许有一定的错误率，可以使用 `Bloom filter`，4G 内存大概可以表示 340 亿 bit。将其中一个文件中的 url 使用 Bloom filter 映射为这 340 亿 bit，然后挨个读取另外一个文件的 url，检查是否与 Bloom filter，如果是，那么该 url 应该是共同的 url（注意会有一定的错误率）。

## 思考

- **`hash 后要判断每个文件大小，如果 hash 分的不均衡有文件较大，还应继续 hash 分文件`**，换个 hash 算法第二次再分较大的文件，一直分到没有较大的文件为止。这样文件标号可以用 A1-2 表示（第一次 hash 编号为 1，文件较大所以参加第二次 hash，编号为 2）

- 由于 1 存在，第一次 hash 如果有大文件，不能用直接 set 的方法。建议对每个文件都先用字符串自然顺序排序，然后具有相同 hash 编号的（如都是 1-3，而不能 a 编号是 1，b 编号是 1-1 和 1-2），可以直接从头到尾比较一遍。对于层级不一致的，如 a1，b 有 1-1，1-2-1，1-2-2，层级浅的要和层级深的每个文件都比较一次，才能确认每个相同的 uri。

以上是网上流传最广的思路，基于以上想法。我主要有两点想法，

- 其一，优秀的哈希算法是经过密码学家证明推敲的，不会随着取模操作而造成大范围冲突。本文将使用到《[字符串哈希算法——BKDRHash](https://blog.csdn.net/qingdujun/article/details/82290532)》算法。

- 其二，对于以上读者反馈中需要二次哈希的地方（这种概率极小）。可以将整个过程视为一场递归——即，将一次哈希中大小超过阈值的文件暂不处理（假设一次哈希后，所得文件 `a_9527 > 10G`，那么这里先不处理它，而直接查询对应的 b_9527，如果对应的 b 不存在，那么可以丢弃 a_9527。否则，在后续处理中，对于 a_9527 使用另外一种哈希算法重新哈希，同时对 b_9527 也必须使用同一种哈希算法重新哈希，整个过程转化为了递归）。

# 算法实现

## Step 1 产生 50 亿 URL

实际操作中，自定义 N 值大小即可，量力（硬盘）而行。这里没有产生 50 亿 URL。

```cpp
//[a,b]
#define random(a,b) ((rand()%(b-a+1))+a)
#define N 500000

string url  = "-0123456789abcdefghijklmnopqrstuvwxyz";

void generateUrl(string file)
{
    ofstream out(file);
    int n = 0;
    if (out.is_open())
    {
        for (int i = 0; i < N; ++i)
        {
            int size = random(1, 64); // 64bit
            string s = "https://www.";

            for (int j = 0, l = 1; j < size; ++j)
            {
                s += url[random(l,36)]; // 1+10+26-1=36
                l = (s[s.size()-1] == '-' || j >= size-1) ? 1: 0;
            }
            s += ".com/";
            out << s << endl;
        }
        out.close();
    }
}

```

## Step 2 将 50 亿 URL 大文件哈希为 10000 个小文件

具体牵涉到不少其他函数，下文将给出。

```cpp
bool split_big_file(string file_name, string suffix, string store_path, unsigned long count_to_split)
{
    if (!file_name.size())
        return false;

    ifstream in(file_name);
    if (!in.is_open())
        return false;

    string line;
    while (getline(in, line))
    {
        string split_file_name = store_path;
        split_file_name += to_string(bkdr_hash(line.c_str()) % count_to_split);
        split_file_name += suffix;
        ofstream out(split_file_name, ios::app);

        if (!out.is_open())
        {
            in.close();
            return false;
        }
        out << line << endl;
        out.close();
    }
    in.close();
    return true;
}

```

### Step 2.1 字符串哈希函数 BKDRHash

更多的哈希函数，可以参阅上文中的链接。

```cpp
unsigned long bkdr_hash(const char* str)
{
    unsigned int seed = 131;
    unsigned int hash = 0;
    while (*str)
    {
        hash = hash*seed+(*str++);
    }
    return (hash & 0x7FFFFFFF);
}

```

### Step 2.2 获取文件大小

获取文件大小的主要作用是——其一，使程序更具有鲁棒性，可以适应于任意大小的文件拆分，保证拆分后的小文件不超过指定内存大小。其二，判断拆分后的文件是否满足要求。

```cpp
unsigned long get_file_size(string file_name)
{
    if (!file_name.size())
        return 0;

    struct stat file_info;
    return stat(file_name.c_str(),&file_info) ? 0 : file_info.st_size;
}

```

### Step 2.3 获取某一目录下指定后缀的所有文件

这里仿照 JAVA 写了个 endsWith 函数，用于过滤后缀。

```cpp
bool str_ends_with(string s, string sub)
{
    return s.rfind(sub)==(s.length()-sub.length());
}

vector<string> get_folder_file_name_list(string folder, string ends_with)
{
    struct dirent *ptr = NULL;

    DIR *dir = opendir(folder.c_str());
    vector<string> files_name;

    while ((ptr = readdir(dir)) != NULL)
    {
        if (ptr->d_name[0] == '.')
            continue;
        if (str_ends_with(ptr->d_name, ends_with))
            files_name.push_back(ptr->d_name);
    }
    closedir(dir);
    return files_name;
}

```

## Step 3 使用 set 将小文件进行求交操作，最终得到相同 URL

```cpp
bool write_same_url_to_file(string folder, string same_url_file_name)
{
    vector<string> files_name_a = get_folder_file_name_list(folder, ".a.txt");
    vector<string> files_name_b = get_folder_file_name_list(folder, ".b.txt");

    vector<string>::iterator iter;
    ofstream out(same_url_file_name, ios::app);

    if (!out.is_open())
        return false;

    for (int i = 0; i < files_name_a.size(); ++i)
    {
        string s = files_name_a[i];
        s[s.size() - 5] = 'b';

        if (get_file_size(files_name_a[i]) <= PER_FILE_SIZE
            && (iter = find(files_name_b.begin(), files_name_b.end(),s)) != files_name_b.end()
            && get_file_size(*iter) <= PER_FILE_SIZE)
        {
            set<string> a_set = get_file_hash_set(folder+files_name_a[i]);
            set<string> b_set = get_file_hash_set(folder+*iter);
            set<string> same_url_set = get_same_url_set(a_set, b_set);
            set<string>::iterator it = same_url_set.begin();

            for (; it != same_url_set.end(); ++it)
            {
                out << *it << endl;
                cout<<*it<<endl;
            }
        }
    }
    out.close();
    return true;
}

```

可运行的程序获取地址：[https://github.com/qingdujun/algorithm/tree/master/others/50billion-url](https://github.com/qingdujun/algorithm/tree/master/others/50billion-url)

[1] [https://blog.csdn.net/v_JULY_v/article/details/6685962](https://blog.csdn.net/v_JULY_v/article/details/6685962)
